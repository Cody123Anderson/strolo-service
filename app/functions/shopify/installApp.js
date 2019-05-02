let nonce = require('nonce')();

import { API_URL, SHOPIFY_API_KEY } from '../../constants';
import { failure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';

const scopes = 'read_orders, write_script_tags, write_orders';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());
    console.info('EVENT RECEIVED: ', event);

    const shop = event.queryStringParameters.shop;

    if (!shop) {
      console.error('Missing shop parameter');
      return reject(failure(400, 'Missing shop parameter'));
    }

    try {
      const state = nonce();
      const forwardingAddress = `${API_URL}/shopify/install-callback`;
      const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopes}&state=${state}&redirect_uri=${forwardingAddress}`;

      let date = new Date();

      // Get Unix milliseconds at current time plus 365 days
      date.setTime(+date + 30 * 86400000); //24 \* 60 \* 60 \* 100

      resolve({
        statusCode: 302,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          Location: installUrl
        }
      });
    } catch (e) {
      console.error('Error in installApp: ', e.response);
      return reject(failure(400, 'Error in installApp: ', e.response));
    }
  });
}