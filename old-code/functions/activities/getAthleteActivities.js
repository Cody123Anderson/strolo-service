import _ from 'lodash';

import * as constants from '../../constants';
import { success, serverFailure, failure } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { requireAuth } from '../../utils/auth';
import { Activity, ActivityType } from '../../models';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    await requireAuth(event, reject, constants.JWT.TYPES.ATHLETE);

    const athleteId = _.get(event, 'pathParameters.athleteId');

    if (!athleteId) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    try {
      const activities = await Activity.findAll({
        where: { athleteId },
        include: [{
          model: ActivityType,
          as: 'activityType',
          order: [['createdAt', 'DESC']]
        }]
      });

      return resolve(success({ activities }));
    } catch (e) {
      console.error('server error getting the activities by athleteId: ', e);
      reject(serverFailure('server error getting the activities by athleteId: ', e));
    }
  });
}
