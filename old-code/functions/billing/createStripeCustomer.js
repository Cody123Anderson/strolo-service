import Axios from 'axios';
import sgMail from '@sendgrid/mail';

import * as dynamoDbUtils from '../../utils/dynamo';
import * as constants from '../../constants';
import { success, serverFailure, failure } from '../../utils/response';
import { getCurrentTimestamp, prettifyDatetime } from '../../utils/time';
import { isLambdaWarmer } from '../../utils/warmer';
import { requireAuth } from '../../utils/auth';
import stripe from '../../utils/stripe';
import { prettifyCurrency } from '../../utils/money';

sgMail.setApiKey(constants.SENDGRID.API_KEY);

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    event.body = JSON.parse(event.body);

    const { email, source, userId, coupon, address, city, state, zip, country, subtotal } = event.body;
    const avataxAuthHeader = `Basic ${Buffer.from(`${constants.AVATAX_USERNAME}:${constants.AVATAX_PASSWORD}`).toString('base64')}`;
    const datetime = getCurrentTimestamp();
    let taxRate;
    let customer;
    let subscription;

    if (!email || !source || !userId || !address || !city || !state || !zip || !country || !subtotal) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    await requireAuth(event, reject, constants.JWT.TYPES.USER);

    // Get the tax rate
    try {
      const taxRateResponse = await Axios.get(
        `${constants.AVATAX_API_URL}?line1=${address}&city=${city}&region=${state}&postalCode=${zip}&country=${country}`,
        { headers: { Authorization: avataxAuthHeader}}
      );

      taxRate = `${(taxRateResponse.data.totalRate * 100).toFixed(4)}`;
    } catch (e) {
      console.error('error getting the tax rate: ', e);
      reject(serverFailure('Server error getting the tax rate', e));
    }

    console.info('taxRate: ', taxRate);

    // Create the stripe customer
    try {
      customer = await stripe.customers.create({ email, source });
    } catch (e) {
      console.error('error creating stripe customer: ', e);
      reject(serverFailure('Server error creating the stripe customer', e));
    }

    console.info('customer: ', customer);

    // Subscribe the stripe customer to a plan
    try {
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: constants.STRIPE_BILLING_PLAN_ID }],
        tax_percent: taxRate,
        coupon
      });
    } catch (e) {
      console.error('error creating stripe subscription: ', e);
      reject(serverFailure('Server error creating the stripe subscription', e));
    }

    console.info('subscription: ', subscription);

    const user = {
      paidThrough: subscription.current_period_end,
      stripeCustomerId: customer.id,
      taxRate,
      updatedAt: datetime
    };
    const params = {
      TableName: constants.AWS.DYNAMO_USERS_TABLE,
      Key: { userId },
      UpdateExpression: dynamoDbUtils.getUpdateExpression(user),
      ExpressionAttributeNames: dynamoDbUtils.getExpressionAttributeNames(user),
      ExpressionAttributeValues: dynamoDbUtils.getExpressionAttributeValues(user),
      ReturnValues: 'ALL_NEW'
    };

    console.info('user: ', user);
    console.info('params: ', params);

    try {
      const result = await dynamoDbUtils.call('update', params);

      console.info('result: ', result);
    } catch (e) {
      console.error('server error updating the user: ', e.response);
      reject(serverFailure('Server error updating the user', e.response));
    }

    // Send a confirmation email to the user
    try {
      const membershipCost = +(+subscription.plan.amount / 100).toFixed(2);
      const renewalAmount = membershipCost + (membershipCost * (+taxRate / 100));
      const discountAmount = (membershipCost - +subtotal).toFixed(2);
      const taxAmount = +(+subtotal * (+taxRate / 100)).toFixed(2);
      const msg = {
        to: email,
        from: 'support@xp-golf.com',
        templateId: constants.SENDGRID.NEW_MEMBER_CHECKOUT_RECEIPT_TEMPLATE_ID,
        dynamic_template_data: {
          dashboardUrl: constants.DASHBOARD_URL,
          userId,
          processedAt: prettifyDatetime(subscription.created),
          membershipCost: prettifyCurrency(membershipCost),
          hasDiscount: coupon ? true : false,
          discountAmount,
          couponCode: coupon,
          subtotal: subtotal,
          taxAmount,
          totalAmount: prettifyCurrency(+subtotal + taxAmount),
          renewalDate: prettifyDatetime(subscription.current_period_end),
          renewalAmount: prettifyCurrency(renewalAmount)
        }
      };

      console.info('msg: ', msg);

      await sgMail.send(msg);
    } catch (err) {
      console.error('error sending the new user email: ', err);
    }

    resolve(success({ status: 'stripe customer created successfully', user }));
  });
}
