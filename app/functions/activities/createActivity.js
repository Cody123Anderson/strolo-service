import uuid from 'uuid';

import { Activity, ActivityType, Athlete, formatActivity } from '../../models';
import * as constants from '../../constants';
import { getCurrentTimestamp } from '../../utils/time';
import { failure, serverFailure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { requireAuth } from '../../utils/auth';
import { parseBody } from '../../utils/format-data';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    // Only athletes or strolo admins can create activities
    await requireAuth(event, reject, constants.JWT.TYPES.ATHLETE);

    const data = parseBody(event.body);
    const timestamp = getCurrentTimestamp();
    let activity;
    let activityType;
    let athlete;

    if (!data.activityTypeId || !data.athleteId || !data.source || !data.inputMethod || !data.durationSeconds) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // Make sure activityTypeId is valid
    try {
      activityType = await ActivityType.findOne({ where: { activityTypeId: data.activityTypeId } });
    } catch (err) {
      console.error('server error checking for activityType: ', err);
      return reject(serverFailure('server error checking for activityType', err.response));
    }

    if (!activityType) {
      console.error('Invalid Request: bad activityTypeId');
      return reject(failure(400, 'Invalid Request: bad activityTypeId'));
    }

    // Make sure athleteId is valid
    try {
      athlete = await Athlete.findOne({ where: { athleteId: data.athleteId } });
    } catch (err) {
      console.error('server error checking for athlete: ', err);
      return reject(serverFailure('server error checking for athlete', err.response));
    }

    if (!athlete) {
      console.error('Invalid Request: bad athleteId');
      return reject(failure(400, 'Invalid Request: bad athleteId'));
    }

    const formattedActivity = formatActivity({
      ...data,
      activityId: uuid.v4(),
      status: constants.ACTIVITY_STATUS.APPROVED,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    console.info('formattedActivity: ', formattedActivity);

    try {
      activity = await Activity.create(formattedActivity);
      activity = activity.dataValues;
    } catch (err) {
      console.error('server error creating activity: ', err);
      return reject(serverFailure('server error creating activity', err.response));
    }

    return resolve(success({ activity }));
  });
}

