import bcrypt from 'bcryptjs';

import Athlete from '../../models/athlete';
import * as constants from '../../constants';
import { failure, serverFailure, success } from '../../utils/response';
import { getAthleteJWT } from '../../utils/jwt';
import { isLambdaWarmer } from '../../utils/warmer';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const data = JSON.parse(event.body);
    let athlete;

    if (!data.email || !data.password) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    try {
      athlete = await Athlete.findOne({ where: { email: data.email } });
    } catch (e) {
      console.error('server error finding the athlete by email: ', e);
      reject(serverFailure('Server error finding the athlete by email', e));
    }

    if (!athlete) {
      // email not found in our db
      return reject(failure(400, 'incorrect email/password combination'));
    }

    // Check if the password is correct
    bcrypt.compare(data.password, athlete.password || 'fail', (err, res) => {
      if (err) {
        console.error('error comparing the athlete\'s passwords: ', err.response);
        return reject(serverFailure('Server error verifying athlete\'s password in the database', err.response));
      }

      if (res) {
        // Passwords match
        // Delete the hashed password from the athlete obj so it's not returned to client
        delete athlete.dataValues.password;

        return resolve(
          success({ token: getAthleteJWT(athlete, constants.JWT.TYPES.USER), athlete })
        );
      }

      // Passwords don't match
      return reject(failure(400, 'incorrect email/password combination'));
    });
  });
}
