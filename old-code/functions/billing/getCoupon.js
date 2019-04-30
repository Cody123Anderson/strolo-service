import _ from 'lodash';

import { success, serverFailure, failure } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';
import stripe from '../../utils/stripe';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const couponCode = _.get(event, 'pathParameters.couponCode');
    let coupon;

    if (!couponCode) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // Get the coupon from stripe
    // Throws 404 error if bad couponCode provided
    try {
      coupon = await stripe.coupons.retrieve(couponCode);

      console.info('coupon: ', coupon);
    } catch (e) {
      console.error('error retrieving stripe coupon: ', e);

      if (e.statusCode === 404) {
        coupon = null;
      } else {
        return reject(serverFailure('Server error retrieving stripe coupon', e));
      }
    }

    return resolve(success({ coupon }));
  });
}
