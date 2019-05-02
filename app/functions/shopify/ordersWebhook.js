import axios from 'axios';
import _ from 'lodash';

import { API_URL } from '../../constants';
import { success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { getInternalRequestOptions } from '../../utils/request';
import { convertStringToUnix } from '../../utils/time';

export async function main(event) {
  return new Promise(async (resolve) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const data = JSON.parse(event.body);
    const shopifyDomain = event.headers['X-Shopify-Shop-Domain'];
    const webhookTopic = _.get(event, 'headers[\'X-Shopify-Topic\']');
    const internalRequestOptions = getInternalRequestOptions();
    let merchant;
    let status = 'created';
    let lineItems = [];

    console.info('data: ', data);
    console.info('shopifyStoreDomain: ', shopifyDomain);
    console.info('webhookTopic: ', webhookTopic);

    // Got notifications that this is failing so I'm putting this here to fix that real fast
    // TODO: Implement a delete order webhook that calls a delete order endpoint on the order service
    if (webhookTopic === 'orders/delete') {
      return resolve(success({ status: 'order being deleted'}));
    }

    try {
      //  Get merchant info from shopify store domain
      const merchantResponse = await axios.get(`${API_URL}/merchants/merchant?shopifyDomain=${shopifyDomain}`, internalRequestOptions);

      console.info('merchantResponse.data: ', merchantResponse.data);

      merchant = _.get(merchantResponse, 'data.merchant');
    } catch (error) {
      console.error('error getting merchant: ', error);
      return resolve(success({ status: 'order failed to update'}));
    }

    if (data.cancelled_at) {
      status = 'cancelled';
    }

    // Format Line Items
    data.line_items.forEach(lineItem => {
      lineItems.push({
        sourceLineItemId: lineItem.id,
        title: lineItem.title,
        quantity: lineItem.quantity,
        price: lineItem.price,
        sku: lineItem.sku,
        variantTitle: lineItem.variant_title,
        vendor: lineItem.vendor,
        productId: lineItem.product_id,
        requiresShipping: lineItem.requires_shipping,
        taxable: lineItem.taxable,
        name: lineItem.name,
        grams: lineItem.grams
      });
    });

    // Structure datecard
    const datecard = {
      source: 'shopify-checkbox',
      sourceOrderId: data.id,
      sourceOrderNumber: data.order_number,
      createdAt: convertStringToUnix(data.created_at),
      updatedAt: convertStringToUnix(data.updated_at),
      firstName: _.get(data, 'customer.first_name') || _.get(data, 'shipping_address.first_name', ''),
      lastName: _.get(data, 'customer.last_name') || _.get(data, 'shipping_address.last_name', ''),
      email: _.get(data, 'customer.email') || data.email,
      currency: data.currency,
      status,
      subtotal: data.subtotal_price,
      taxes: data.total_tax,
      merchantId: merchant.merchantId,
      destination: {
        firstName: _.get(data, 'shipping_address.first_name', ''),
        lastName: _.get(data, 'shipping_address.last_name', ''),
        company: _.get(data, 'shipping_address.company', ''),
        address: _.get(data, 'shipping_address.address', ''),
        address2: _.get(data, 'shipping_address.address2', ''),
        city: _.get(data, 'shipping_address.city', ''),
        province: _.get(data, 'shipping_address.province', ''),
        zip: _.get(data, 'shipping_address.zip', ''),
        countryCode: _.get(data, 'shipping_address.country_code', ''),
        phone: _.get(data, 'shipping_address.phone', '')
      },
      lineItems
    };

    console.info('datecard: ', datecard);

    // Call order service with order
    try {
      const putDatecardResponse = await axios.put(`${API_URL}/datecards`, datecard, internalRequestOptions);

      console.info('createOrderResponse: ', putDatecardResponse.data);

      return resolve(success({ status: 'order updated successfully'}));
    } catch (error) {
      console.error('error creating order: ', error.response);
      return resolve(success({ status: 'order failed to update'}));
    }
  });
}
