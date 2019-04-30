import stripe from 'stripe';

import { STRIPE_API_KEY } from '../constants';

module.exports = stripe(STRIPE_API_KEY);
