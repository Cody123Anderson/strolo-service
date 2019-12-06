import sendgrid from '@sendgrid/mail';

import { SENDGRID } from '../constants';

sendgrid.setApiKey(SENDGRID.API_KEY);

module.exports = { sendgrid };
