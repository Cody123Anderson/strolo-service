import axios from 'axios';

import { failure, success } from '../../utils/response';
import { API_URL } from '../../constants';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    console.info('EVENT RECEIVED: ', event);

    for (const record of event.Records) {
      const { merchant } = JSON.parse(record.Sns.Message);
      const shopRequestOptions = {
        headers: {
          'X-Shopify-Access-Token': merchant.shopifyAccessToken,
          'Content-Type': 'application/json'
        }
      };
      const shopWebhooksUrl = `https://${merchant.shopifyDomain}/admin/webhooks.json`;

      console.info('merchant: ', merchant);

      // Add webhook subscriptions for orders
      try {
        const orderWebhookTopics = [
          'orders/create',
          'orders/updated',
          'orders/delete',
          'orders/cancelled'
        ];

        for (const topic of orderWebhookTopics) {
          console.info('topic: ', topic);
          const getWebhookResponse = await axios.get(`${shopWebhooksUrl}?topic=${topic}`, shopRequestOptions);

          console.info('getWebhookResponse.data: ', getWebhookResponse.data);

          if (getWebhookResponse.data.webhooks.length < 1) {
            // Need to add the webhook
            const webhookBody = {
              webhook: {
                topic,
                address: `${API_URL}/shopify/orders`,
                format: 'json'
              }
            };
            const webhookResponse = await axios.post(shopWebhooksUrl, webhookBody, shopRequestOptions);

            console.info('webhookResponse.data: ', webhookResponse.data);
          }
        }
      } catch (e) {
        console.error('Error adding webhook subscriptions for orders: ', JSON.stringify(e.response));
        return reject(failure(400, 'Error adding webhook subscriptions for orders: ', e.response));
      }
    }

    resolve(success({ status: 'serenade webhooks installed successfully' }));
  });
}