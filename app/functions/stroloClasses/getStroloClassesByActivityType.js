import _ from 'lodash';

import { success, serverFailure, failure } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { StroloClass } from '../../models';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const activityTypeId = _.get(event, 'pathParameters.activityTypeId');

    if (!activityTypeId) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    try {
      const stroloClasses = await StroloClass.findAll({
        where: { activityTypeId },
        order: [['createdAt', 'DESC']]
      });

      return resolve(success({ stroloClasses }));
    } catch (e) {
      console.error('server error getting the stroloClasses by activityTypeId: ', e);
      reject(serverFailure('server error getting the stroloClasses by activityTypeId: ', e));
    }
  });
}
