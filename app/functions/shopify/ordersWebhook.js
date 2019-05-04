import axios from 'axios';
import _ from 'lodash';

import { API_URL } from '../../constants';
import { success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { getInternalRequestOptions } from '../../utils/request';
import { convertStringToUnix, getCurrentTimestamp } from '../../utils/time';
import { tempDatecardStatuses, getTempDatecard } from '../tempDatecards/tempDatecardModel';

export async function main(event) {
  return new Promise(async (resolve) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const data = JSON.parse(event.body);
    // const hmacVerification = _.get(event, 'headers[\'X-Shopify-Hmac-SHA256\']');
    const webhookTopic = _.get(event, 'headers[\'X-Shopify-Topic\']');
    const internalRequestOptions = getInternalRequestOptions();
    let lineItems = [];

    console.info('data: ', data);
    console.info('webhookTopic: ', webhookTopic);

    if (webhookTopic === 'orders/delete') {
      const tempDatecard = {
        deletedAt: getCurrentTimestamp(),
        status: tempDatecardStatuses.deleted,
        shopifyOrderId: data.shopifyOrderId
      };

      console.info('tempDatecard: ', tempDatecard);

      try {
        const deleteTempDatecardResponse = await axios.put(`${API_URL}/temp-datecards`, tempDatecard, internalRequestOptions);

        console.info('deleteTempDatecardResponse: ', deleteTempDatecardResponse.data);

        return resolve(success({ status: 'order deleted successfully'}));
      } catch (error) {
        console.error('error deleting order: ', error.response);
        return resolve(success({ status: 'failed to delete order'}));
      }
    } else if (webhookTopic === 'orders/cancelled') {
      const tempDatecard = {
        cancelledAt: getCurrentTimestamp(),
        status: tempDatecardStatuses.cancelled,
        shopifyOrderId: data.shopifyOrderId
      };

      console.info('tempDatecard: ', tempDatecard);

      try {
        const cancelTempDatecardResponse = await axios.put(`${API_URL}/temp-datecards`, tempDatecard, internalRequestOptions);

        console.info('cancelTempDatecardResponse: ', cancelTempDatecardResponse.data);

        return resolve(success({ status: 'order cancelled successfully'}));
      } catch (error) {
        console.error('error cancelling order: ', error.response);
        return resolve(success({ status: 'failed to cancel order'}));
      }
    }

    // Format Line Items
    data.line_items.forEach(lineItem => {
      lineItems.push({
        shopifyLineItemId: lineItem.id,
        shopifyProductId: lineItem.product_id,
        quantity: lineItem.quantity,
        name: lineItem.name,
        title: lineItem.title,
        variantTitle: lineItem.variant_title,
        retailPrice: lineItem.compare_price,
        price: lineItem.price,
        businessName: lineItem.vendor
      });
    });

    if (webhookTopic === 'orders/updated') {
      const tempDatecard = getTempDatecard({
        shopifyOrderId: data.id,
        shopifyOrderNumber: data.order_number,
        createdAt: convertStringToUnix(data.created_at),
        updatedAt: convertStringToUnix(data.updated_at),
        dealItems: lineItems,
        defaultCleverPhrase: 'Do you want to go out with me? Yes or yes?',
        userEmail: _.get(data, 'customer.email') || data.email,
        userFirstName:  _.get(data, 'customer.first_name') || _.get(data, 'shipping_address.first_name', '') || data.first_name,
        userLastName: _.get(data, 'customer.last_name') || _.get(data, 'shipping_address.last_name', '') || data.last_name
      });

      console.info('tempDatecard: ', tempDatecard);

      try {
        const updateTempDatecardResponse = await axios.put(`${API_URL}/temp-datecards`, tempDatecard, internalRequestOptions);

        console.info('updateTempDatecardResponse: ', updateTempDatecardResponse.data);

        return resolve(success({ status: 'tempDatecard updated successfully'}));
      } catch (error) {
        console.error('error updating tempDatecard: ', error.response);
        return resolve(success({ status: 'tempDatecard update failed'}));
      }
    } else if (webhookTopic === 'orders/create') {
      const tempDatecard = getTempDatecard({
        shopifyOrderId: data.id,
        shopifyOrderNumber: data.order_number,
        createdAt: convertStringToUnix(data.created_at),
        updatedAt: convertStringToUnix(data.updated_at),
        dealItems: lineItems,
        defaultCleverPhrase: 'Do you want to go out with me? Yes or yes?',
        userEmail: _.get(data, 'customer.email') || data.email,
        userFirstName:  _.get(data, 'customer.first_name') || _.get(data, 'shipping_address.first_name', '') || data.first_name,
        userLastName: _.get(data, 'customer.last_name') || _.get(data, 'shipping_address.last_name', '') || data.last_name
      });

      console.info('tempDatecard: ', tempDatecard);

      try {
        const createTempDatecardResponse = await axios.post(`${API_URL}/temp-datecards`, tempDatecard, internalRequestOptions);

        console.info('createTempDatecardResponse: ', createTempDatecardResponse.data);

        return resolve(success({ status: 'tempDatecard created successfully'}));
      } catch (error) {
        console.error('error creating tempDatecard: ', error.response);
        return resolve(success({ status: 'tempDatecard creation failed'}));
      }
    }
  });
}
