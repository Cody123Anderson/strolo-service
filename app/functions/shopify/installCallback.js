import axios from 'axios';
import crypto from 'crypto';
import querystring from 'querystring';

import { failure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOP_URL, SNS_TOPIC_ARNS } from '../../constants';
import SNS from '../../utils/sns';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());
    console.info('EVENT RECEIVED: ', event);

    const { shop, hmac, code } = event.queryStringParameters;
    const shopUrl = `https://${shop}/admin`;
    let accessToken;
    let merchantBody = {};
    let hashEquals = false;

    if (!shop || !hmac || !code) {
      console.error('Missing required parameters');
      return reject(failure(400, 'Missing required parameters'));
    }

    const map = Object.assign({}, event.queryStringParameters);

    delete map['signature'];
    delete map['hmac'];

    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, 'utf-8');
    const generatedHash = Buffer.from(
      crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(message).digest('hex'),
      'utf-8'
    );

    // Check for timing attacks. Arguments must be buffers
    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
      // timingSafeEqual will return an error if the input buffers are not the same length.
    } catch (e) {
      console.error('error checking for timing attack: ', e.response);
      hashEquals = false;
    }

    if (!hashEquals) {
      console.error('HMAC validation failed');
      return reject(failure(400, 'HMAC validation failed'));
    }

    // Get a permanent access token to the merchant's shop
    try {
      const accessTokenRequestUrl = `${shopUrl}/oauth/access_token`;
      const accessTokenPayload = { client_id: SHOPIFY_API_KEY, client_secret: SHOPIFY_API_SECRET, code };
      const accessTokenResponse = await axios.post(accessTokenRequestUrl, accessTokenPayload);

      console.info('accessTokenResponse: ', accessTokenResponse);

      accessToken = accessTokenResponse.data.access_token;
    } catch (e) {
      console.error('Error getting access token: ', JSON.stringify(e.response));
      return reject(failure(400, 'Error getting access token: ', e.response));
    }

    // Get shop info to use to create the merchant account
    try {
      const shopRequestOptions = {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      };

      const shopInfoResponse = await axios.get(`https://${shop}/admin/shop.json`, shopRequestOptions);

      console.info('shopInfoResponse: ', shopInfoResponse);

      merchantBody = {
        shopifyDomain: shopInfoResponse.data.shop.myshopify_domain,
        shopifyAccessToken: accessToken
      };
    } catch (e) {
      console.error('Error getting shop info: ', JSON.stringify(e.response));
      return reject(failure(400, 'Error getting shop info: ', e.response));
    }

    // Create the serenadeShopifyAppInstall SNS event to have background processes run
    const snsData = { merchant: merchantBody };
    const snsParams = {
      Message: JSON.stringify(snsData),
      TopicArn: SNS_TOPIC_ARNS.SERENADE_SHOPIFY_INSTALL
    };

    console.info('snsParams: ', snsParams);

    await SNS.publish(snsParams).promise().then(data => {
      console.info(`message sent to the topic ${snsParams.TopicArn}`);
      console.info(`MessageID is ${data.MessageId}`);
    }).catch(e => {
      console.error('Error creating the SNS event: ', e, e.stack);
      return reject(failure(400, 'Error creating the SNS event: ', e));
    });

    // Redirect to dashboard
    const responseBody = {
      statusCode: 302,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        Location: SHOP_URL
      }
    };

    return resolve(responseBody);
  });
}