import _ from 'lodash';
import uuid from 'uuid';
import sgMail from '@sendgrid/mail';

const User = require('../../models/user');
import { formatUser } from '../../utils/user';
import { getJWT } from '../../utils/jwt';
import { hashPassword } from '../../utils/password';

import * as constants from '../../constants';
import { failure, serverFailure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';

sgMail.setApiKey(constants.SENDGRID.API_KEY);

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const data = JSON.parse(event.body);
    let user;
    let hashedPassword;

    // // lowercase the email
    data.email = _.toLower(data.email);

    const { email, password } = data;

    if (!email || !password) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // See if a user with given email already exists
    try {
      user = await User.findOne({ where: { email } });
    } catch (err) {
      console.error('server error checking for user: ', err);
      return reject(serverFailure('server error checking for user', err.response));
    }

    if (user) {
      console.error('Invalid Request: a user with this email already exists');
      return reject(failure(422, 'Invalid Request: a user with this email already exists'));
    }

    // // Hash the password
    try {
      hashedPassword = hashPassword(password);
    } catch (err) {
      console.error('server error hashing user\'s password: ', err);
      return reject(serverFailure('server error hashing user\'s password', err.response));
    }

    const formattedUser = formatUser({
      userId: uuid.v4(),
      email,
      password: hashedPassword,
      status: constants.USER_STATUS.ACTIVE
    });

    console.info('formattedUser: ', formattedUser);

    User.create(formattedUser).then(newUser => {
      console.info('user in create: ', newUser);
      user = newUser.dataValues;
    }).catch(err => {
      console.error('server error creating user: ', err);
      return reject(serverFailure('server error creating user', err.response));
    });

    // Send an email to the user to confirm their email address
    try {
      const msg = {
        to: email,
        from: 'system@serenadedates.com',
        templateId: constants.SENDGRID.NEW_MEMBER_TEMPLATE_ID
      };

      console.info('msg: ', msg);

      await sgMail.send(msg);
    } catch (err) {
      console.error('error sending the new user email: ', err);
    }

    console.log('user: ', user);
    // Don't return the user's hashed password
    delete user.password;

    return resolve(success({ user, token: getJWT(user, constants.USER_TYPES.USER) }));
  });
}

