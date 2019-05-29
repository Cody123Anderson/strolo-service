import axios from 'axios';

import * as constants from '../../constants';
import { failure, serverFailure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    event.body = JSON.parse(event.body);

    const data = event.body;
    let accountResponse;

    console.info('Event Received: ', data);

    if (!data.code) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // Finalize stripe account creation
    try {
      const body = {
        client_secret: constants.STRIPE_SECRET_KEY,
        code: data.code,
        grant_type: 'authorization_code'
      };

      accountResponse = await axios.post('https://connect.stripe.com/oauth/token', body);

      console.info('accountResponse: ', accountResponse);

      return resolve(success({ data: accountResponse.data }));
    } catch (error) {
      console.error('error finalizing account creation: ', error);
      return reject(serverFailure('server error finalizing account creation', error.response));
    }
  });
}