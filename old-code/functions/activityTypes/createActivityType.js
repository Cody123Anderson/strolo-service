import uuid from 'uuid';

import { ActivityType, formatActivityType } from '../../models';
import * as constants from '../../constants';
import { getCurrentTimestamp } from '../../utils/time';
import { failure, serverFailure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
// import { requireAuth } from '../../utils/auth';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    // Only allow strolo admins to create activityTypes
    // await requireAuth(event, reject);

    const data = JSON.parse(event.body);
    const timestamp = getCurrentTimestamp();
    let activityType;

    if (!data.type) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // See if an activityType with given type already exists
    try {
      activityType = await ActivityType.findOne({ where: { type: data.type } });
    } catch (err) {
      console.error('server error checking for activityType: ', err);
      return reject(serverFailure('server error checking for activityType', err.response));
    }

    if (activityType) {
      console.error('Invalid Request: an activityType with this type already exists');
      return reject(failure(422, 'Invalid Request: an activityType with this type already exists'));
    }

    const formattedActivityType = formatActivityType({
      type: data.type,
      rewardsEffortLevel: data.rewardsEffortLevel || 1.00,
      activityTypeId: uuid.v4(),
      status: constants.ACTIVITY_TYPE_STATUS.ACTIVE,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    console.info('formattedActivityType: ', formattedActivityType);

    try {
      activityType = await ActivityType.create(formattedActivityType);
      activityType = activityType.dataValues;
    } catch (err) {
      console.error('server error creating activityType: ', err);
      return reject(serverFailure('server error creating activityType', err.response));
    }

    return resolve(success({ activityType }));
  });
}

