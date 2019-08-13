import _ from 'lodash';

import * as constants from '../../constants';
import { success, serverFailure, failure } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { requireAuth } from '../../utils/auth';
import { Athlete, Sponsor } from '../../models';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    await requireAuth(event, reject, constants.JWT.TYPES.ATHLETE);

    const athleteId = _.get(event, 'queryStringParameters.athleteId');
    const email = _.get(event, 'queryStringParameters.email');
    const username = _.get(event, 'queryStringParameters.username');
    let athlete;

    if (!athleteId && !username && !email) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    if (athleteId) {
      try {
        athlete = await Athlete.findOne({
          where: { athleteId },
          include: [{
            model: Sponsor,
            as: 'sponsorships'
          }]
        });
      } catch (e) {
        console.error('server error finding the athlete by athleteId: ', e);
        reject(serverFailure('Server error finding the athlete by athleteId', e));
      }
    } else if (username) {
      try {
        athlete = await Athlete.findOne({
          where: { username },
          include: [{
            model: Sponsor,
            as: 'sponsorships'
          }]
        });
      } catch (e) {
        console.error('server error finding the athlete by username: ', e);
        reject(serverFailure('Server error finding the athlete by username', e));
      }
    } else if (email) {
      try {
        athlete = await Athlete.findOne({
          where: { email },
          include: [{
            model: Sponsor,
            as: 'sponsorships'
          }]
        });
      } catch (e) {
        console.error('server error finding the athlete by email: ', e);
        reject(serverFailure('Server error finding the athlete by email', e));
      }
    }

    if (!athlete) {
      return resolve(failure(404, 'No athlete found'));
    }

    delete athlete.dataValues.password;

    return resolve(success({ athlete }));
  });
}
