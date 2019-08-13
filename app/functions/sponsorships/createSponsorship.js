import { find } from 'lodash';

import { Athlete, Sponsor, Sponsorship, formatSponsorship } from '../../models';
import * as constants from '../../constants';
import { getCurrentTimestamp } from '../../utils/time';
import { failure, serverFailure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { requireAuth } from '../../utils/auth';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    // Only athletes or strolo admins can create sponsorships
    await requireAuth(event, reject, constants.JWT.TYPES.ATHLETE);

    const data = JSON.parse(event.body);
    const timestamp = getCurrentTimestamp();
    const { sponsorId, athleteId, code } = data;
    let athlete;
    let sponsor;
    let sponsorship;

    console.info('data: ', data);

    if (!sponsorId || !athleteId || !code) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // See if a sponsorship with given athleteId and sponsorId already exists
    try {
      sponsor = await Sponsor.findOne({
        where: { sponsorId },
        include: [{ model: Athlete }]
      });
    } catch (err) {
      console.error('server error checking for sponsorship: ', err);
      return reject(serverFailure('server error checking for sponsorship', err.response));
    }

    console.info('sponsor: ', sponsor);

    if (sponsor) {
      // Need to check if athlete is already sponsored by this sponsor
      const sponsoredAthlete = find(sponsor.athletes, { athleteId });

      if (sponsoredAthlete) {
        console.error('Invalid Request: this sponsorship already exists');
        return reject(failure(422, 'Invalid Request: this sponsorship already exists'));
      }
    } else {
      console.error('Invalid Request: couldn\'t find sponsor');
      return reject(failure(404, 'Invalid Request: couldn\'t find sponsor'));
    }

    // Make sure athleteId is valid
    try {
      athlete = await Athlete.findOne({ where: { athleteId } });
    } catch (err) {
      console.error('server error checking for athlete: ', err);
      return reject(serverFailure('server error checking for athlete', err.response));
    }

    if (!athlete) {
      console.error('Invalid Request: couldn\'t find athlete');
      return reject(failure(404, 'Invalid Request: couldn\'t find athlete'));
    }

    // Make sure sponsor code matches
    if (code !== sponsor.code) {
      console.error('Invalid Request: sponsor code is invalid');
      return reject(failure(400, 'Invalid Request: sponsor code is invalid'));
    }

    const formattedSponsorship = formatSponsorship({
      athleteId,
      sponsorId,
      startDate: data.startDate || timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: constants.SPONSORSHIP_STATUS.ACTIVE,
      approvedAt: timestamp
    });

    console.info('formattedSponsorship: ', formattedSponsorship);

    try {
      sponsorship = await Sponsorship.create(formattedSponsorship);
      sponsorship = sponsorship.dataValues;
    } catch (err) {
      console.error('server error creating sponsorship: ', err);
      return reject(serverFailure('server error creating sponsorship', err.response));
    }

    return resolve(success({ sponsorship }));
  });
}

