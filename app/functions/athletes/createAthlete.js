import _ from 'lodash';
import uuid from 'uuid';
import sgMail from '@sendgrid/mail';

import Athlete from '../../models/athlete';
import { formatAthlete } from '../../utils/athlete';
import { getAthleteJWT } from '../../utils/jwt';
import { hashPassword } from '../../utils/password';
import * as constants from '../../constants';
import { getCurrentTimestamp } from '../../utils/time';
import { failure, serverFailure, success } from '../../utils/response';
import { isLambdaWarmer } from '../../utils/warmer';

sgMail.setApiKey(constants.SENDGRID.API_KEY);

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const data = JSON.parse(event.body);
    const timestamp = getCurrentTimestamp();
    let athlete;
    let hashedPassword;

    // Lowercase the email
    data.email = _.toLower(data.email);

    const { email, password } = data;

    if (!email || !password) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // See if a athlete with given email already exists
    try {
      athlete = await Athlete.findOne({ where: { email } });
    } catch (err) {
      console.error('server error checking for athlete: ', err);
      return reject(serverFailure('server error checking for athlete', err.response));
    }

    if (athlete) {
      console.error('Invalid Request: an athlete with this email already exists');
      return reject(failure(422, 'Invalid Request: an athlete with this email already exists'));
    }

    // Hash the password
    try {
      hashedPassword = hashPassword(password);
    } catch (err) {
      console.error('server error hashing athlete\'s password: ', err);
      return reject(serverFailure('server error hashing athlete\'s password', err.response));
    }

    const formattedAthlete = formatAthlete({
      athleteId: uuid.v4(),
      createdAt: timestamp,
      updatedAt: timestamp,
      email,
      password: hashedPassword,
      status: constants.ATHLETE_STATUS.ACTIVE
    });

    console.info('formattedAthlete: ', formattedAthlete);

    try {
      athlete = await Athlete.create(formattedAthlete);
      athlete = athlete.dataValues;
    } catch (err) {
      console.error('server error creating athlete: ', err);
      return reject(serverFailure('server error creating athlete', err.response));
    }

    // Send an email to the athlete to confirm their email address
    // try {
    //   const msg = {
    //     to: email,
    //     from: 'system@strolo.io',
    //     templateId: constants.SENDGRID.NEW_MEMBER_TEMPLATE_ID
    //   };

    //   console.info('msg: ', msg);

    //   await sgMail.send(msg);
    // } catch (err) {
    //   console.error('error sending the new athlete email: ', err);
    // }

    // Don't return the athlete's hashed password
    delete athlete.password;

    return resolve(success({ athlete, token: getAthleteJWT(athlete, constants.USER_TYPES.ATHLETE) }));
  });
}

