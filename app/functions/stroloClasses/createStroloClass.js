import uuid from 'uuid';

import { ActivityType, StroloClass, formatStroloClass } from '../../models';
// import * as constants from '../../constants';
import { getCurrentTimestamp } from '../../utils/time';
import { failure, serverFailure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
// import { requireAuth } from '../../utils/auth';
import { parseBody } from '../../utils/format-data';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    // Only Strolo Admins can create classes
    // await requireAuth(event, reject, constants.JWT.TYPES.ATHLETE);

    const data = parseBody(event.body);
    const timestamp = getCurrentTimestamp();
    let stroloClass;
    let activityType;

    if (!data.activityTypeId || !data.name || !data.videoUrl || !data.instructorFirstName || !data.length) {
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

    const formattedStroloClass = formatStroloClass({
      ...data,
      stroloClassId: uuid.v4(),
      goLiveAt: data.goLiveAt || timestamp,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    console.info('formattedStroloClass: ', formattedStroloClass);

    try {
      stroloClass = await StroloClass.create(formattedStroloClass);
      stroloClass = stroloClass.dataValues;
    } catch (err) {
      console.error('server error creating stroloClass: ', err);
      return reject(serverFailure('server error creating stroloClass', err.response));
    }

    return resolve(success({ stroloClass }));
  });
}

