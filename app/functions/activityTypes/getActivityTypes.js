import _ from 'lodash';

import { success, serverFailure, failure } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { ActivityType } from '../../models';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    try {
      const activityTypes = await ActivityType.findAll();

      return resolve(success({ activityTypes }));
    } catch (e) {
      console.error('server error getting activityTypes: ', e);
      reject(serverFailure('server error getting activityTypes: ', e));
    }
  });
}
