import uuid from 'uuid';

import { Sponsor, formatSponsor } from '../../models';
import * as constants from '../../constants';
import { getCurrentTimestamp } from '../../utils/time';
import { failure, serverFailure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { requireAuth } from '../../utils/auth';
import { getRandomString } from '../../utils/string';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    // Only athletes or strolo admins can create sponsors
    await requireAuth(event, reject, constants.JWT.TYPES.ATHLETE);

    const data = JSON.parse(event.body);
    const timestamp = getCurrentTimestamp();
    let sponsor;

    if (!data.name || !data.athleteId) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // See if a sponsor with given name already exists
    try {
      sponsor = await Sponsor.findOne({ where: { name: data.name } });
    } catch (err) {
      console.error('server error checking for sponsor: ', err);
      return reject(serverFailure('server error checking for sponsor', err.response));
    }

    if (sponsor) {
      console.error('Invalid Request: an sponsor with this email already exists');
      return reject(failure(422, 'Invalid Request: an sponsor with this email already exists'));
    }

    const formattedSponsor = formatSponsor({
      measurementUnits: constants.MEASUREMENT_UNITS.IMPERIAL,
      type: constants.SPONSOR_TYPES.CORPORATE,
      ...data,
      sponsorId: uuid.v4(),
      createdByAthleteId: data.athleteId,
      code: getRandomString(6),
      createdAt: timestamp,
      updatedAt: timestamp,
      status: constants.SPONSOR_STATUS.PENDING_CONFIG
    });

    console.info('formattedSponsor: ', formattedSponsor);

    try {
      sponsor = await Sponsor.create(formattedSponsor);
      sponsor = sponsor.dataValues;
    } catch (err) {
      console.error('server error creating sponsor: ', err);
      return reject(serverFailure('server error creating sponsor', err.response));
    }

    return resolve(success({ sponsor }));
  });
}

