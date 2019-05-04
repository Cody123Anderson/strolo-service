import _ from 'lodash';

import * as dynamoDbUtils from '../../utils/dynamo';
import * as constants from '../../constants';
import { success, serverFailure, failure } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const tempDatecardId = _.get(event, 'queryStringParameters.tempDatecardId');
    const shopifyOrderId = _.get(event, 'queryStringParameters.shopifyOrderId');
    let params;

    if (!tempDatecardId && !shopifyOrderId) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    if (tempDatecardId) {
      params = {
        TableName: constants.AWS.DYNAMO_TEMP_DATECARD_TABLE,
        Key: { tempDatecardId }
      };

      console.info('params: ', params);

      try {
        const result = await dynamoDbUtils.call('get', params);
        const tempDatecard = result.Item;

        console.info('result: ', result);

        if (!tempDatecard) {
          return resolve(success({
            status: 'No tempDatecard found',
            tempDatecard: {}
          }));
        }

        return resolve(success({ tempDatecard: result.Item }));
      } catch (err) {
        console.error('server error getting the tempDatecard: ', err);
        return reject(serverFailure('Server error getting the tempDatecard', err));
      }
    } else if (shopifyOrderId) {
      params = {
        TableName: constants.AWS.DYNAMO_TEMP_DATECARD_TABLE,
        IndexName: 'shopifyOrderId-index',
        KeyConditionExpression: 'shopifyOrderId = :shopifyOrderId',
        ExpressionAttributeValues: dynamoDbUtils.getExpressionAttributeValues({ shopifyOrderId })
      };
    }

    console.info('params: ', params);

    try {
      const result = await dynamoDbUtils.call('query', params);
      const tempDatecard = result.Items[0];

      console.info('result: ', result);

      if (!tempDatecard) {
        return resolve(success({
          status: 'No tempDatecard found',
          tempDatecard: {}
        }));
      }

      return resolve(success({ tempDatecard }));
    } catch (err) {
      console.error('server error getting the tempDatecard: ', err);
      return reject(serverFailure('Server error getting the tempDatecard', err));
    }
  });
}
