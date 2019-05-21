import * as dynamoDbUtils from '../../utils/dynamo';
import * as constants from '../../constants';
import { success, serverFailure } from '../../utils/response';
import { getCurrentTimestamp } from '../../utils/time';
import { getTempDatecard } from './tempDatecardModel';
import { isLambdaWarmer } from '../../utils/warmer';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    event.body = JSON.parse(event.body);

    console.info('event.body: ', event.body);

    const datetime = getCurrentTimestamp();
    const tempDatecard = {
      ...getTempDatecard(event.body),
      updatedAt: datetime
    };
    const params = {
      TableName: constants.AWS.DYNAMO_TEMP_DATECARD_TABLE,
      Key: { tempDatecardId: event.pathParameters.tempDatecardId },
      UpdateExpression: dynamoDbUtils.getUpdateExpression(tempDatecard),
      ExpressionAttributeNames: dynamoDbUtils.getExpressionAttributeNames(tempDatecard),
      ExpressionAttributeValues: dynamoDbUtils.getExpressionAttributeValues(tempDatecard),
      ReturnValues: 'ALL_NEW'
    };

    console.info('tempDatecard: ', tempDatecard);
    console.info('params: ', params);

    try {
      const result = await dynamoDbUtils.call('update', params);

      console.info('result: ', result);

      resolve(success({ status: 'tempDatecard updated successfully', tempDatecard }));
    } catch (e) {
      console.error('server error updating the user: ', e.response);
      reject(serverFailure('Server error updating the user', e.response));
    }
  });
}