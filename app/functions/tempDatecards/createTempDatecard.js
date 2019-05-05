import uuid from 'uuid';
import _ from 'lodash';
import sgMail from '@sendgrid/mail';

import * as constants from '../../constants';
import * as dynamoDbUtils from '../../utils/dynamo';
import { failure, serverFailure, success } from '../../utils/response';
import { getCurrentTimestamp, getTimestampForXDaysInFuture } from '../../utils/time';
import { getTempDatecard, tempDatecardStatuses } from './tempDatecardModel';
import { isLambdaWarmer } from '../../utils/warmer';

sgMail.setApiKey(constants.SENDGRID.API_KEY);

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    event.body = JSON.parse(event.body);

    const data = event.body;
    const datetime = getCurrentTimestamp();
    let existingTempDatecards;

    console.info('Event Received: ', data);

    if (!data.userEmail || !data.shopifyOrderId) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // lowercase the email address
    data.userEmail = _.toLower(data.userEmail);

    // Check to see if tempDatecard exists already
    const shopifyOrderIdQueryParams = {
      TableName: constants.AWS.DYNAMO_TEMP_DATECARD_TABLE,
      IndexName: 'shopifyOrderId-index',
      KeyConditionExpression: 'shopifyOrderId = :shopifyOrderId',
      ExpressionAttributeValues: dynamoDbUtils.getExpressionAttributeValues({ shopifyOrderId: data.shopifyOrderId })
    };

    console.info('shopifyOrderIdQueryParams: ', shopifyOrderIdQueryParams);

    try {
      const queryResults = await dynamoDbUtils.call('query', shopifyOrderIdQueryParams);
      console.info('queryResults: ', queryResults);

      existingTempDatecards = _.find(queryResults.Items, { shopifyOrderId: data.shopifyOrderId });
    } catch (err) {
      console.error('server error checking for existing tempDatecard: ', err);
      return reject(
        serverFailure('server error checking for existing tempDatecard', err.response)
      );
    }

    // Don't allow existing tempDatecard to be recreated
    if (existingTempDatecards) {
      return resolve(success({ tempDatecardAlreadyExists: true, success: false }));
    }

    // Create a new user
    const tempDatecard = getTempDatecard({
      ...data,
      tempDatecardId: uuid.v4(),
      status: tempDatecardStatuses.active,
      expirationDate: getTimestampForXDaysInFuture(45),
      createdAt: data.createdAt || datetime,
      updatedAt: data.updatedAt || datetime
    });

    const putParams = {
      TableName: constants.AWS.DYNAMO_TEMP_DATECARD_TABLE,
      Item: tempDatecard
    };
    let responseBody;

    console.info('putParams: ', putParams);

    // write the tempDatecard to the database
    try {
      const response = await dynamoDbUtils.call('put', putParams);

      console.info('putResponse: ', response);

      responseBody = { tempDatecard };
    } catch (err) {
      console.error('error saving the tempDatecard in the database: ', err);
      return reject(serverFailure('server error creating the tempDatecard', err.response));
    }

    // Send an email to the user with their datecard
    try {
      const msg = {
        to: tempDatecard.userEmail,
        from: {
          email: 'dates@serenadedates.com',
          name: 'Serenade Dates'
        },
        templateId: constants.SENDGRID.NEW_TEMP_DATECARD_TEMPLATE_ID,
        dynamic_template_data: {
          datecardUrl: `${constants.DASHBOARD_URL}/datecards/${tempDatecard.tempDatecardId}/order/${tempDatecard.shopifyOrderId}`,
          userFirstName: tempDatecard.userFirstName,
          firstDealItemTitle: tempDatecard.dealItems[0].title,
          additionalItemsBool: tempDatecard.dealItems.length - 1 > 0,
          additionalItemsLength: tempDatecard.dealItems.length - 1
        }
      };

      console.info('msg: ', msg);

      await sgMail.send(msg);
    } catch (err) {
      console.error('error sending the user their new temp datecard email: ', err);
    }

    return resolve(success(responseBody));
  });
}