import moment from 'moment';
import bcrypt from 'bcryptjs';

import Athlete from '../../models/athlete';
import { failure, serverFailure, success } from '../../utils/response';
import { getCurrentTimestamp } from '../../utils/time';
import { formatAthlete } from '../../utils/athlete';
import { isLambdaWarmer } from '../../utils/warmer';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const data = JSON.parse(event.body);
    let athlete;

    console.info('Event Received: ', data);

    if (!data.passwordResetToken || !data.newPassword) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    // Get athlete that will be updated
    try {
      athlete = await Athlete.findOne({ where: { passwordResetToken: data.passwordResetToken } });
    } catch (e) {
      console.error('server error finding the athlete by passwordResetToken: ', e);
      reject(serverFailure('Server error finding the athlete by passwordResetToken', e));
    }

    if (!athlete) {
      return reject(failure(404, 'no athlete with this passwordResetToken found in db'));
    } else if (!athlete.passwordResetExpiration || moment().isAfter(athlete.passwordResetExpiration)) {
      return reject(failure(401, 'passwordResetToken has expired'));
    }

    delete athlete.dataValues.password;

    console.info('athlete: ', athlete);

    // Hash the newPassword
    bcrypt.hash(data.newPassword, 11, async (err, hashedPassword) => {
      if (err) {
        console.error('error hashing the athlete\'s newPassword: ', err);
        return reject(serverFailure('error hashing the athlete\'s newPassword: ', err));
      }

      const updatedAthlete = formatAthlete({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiration: null,
        updatedAt: getCurrentTimestamp()
      });

      try {
        athlete.update(updatedAthlete);
            
        return resolve(success({ status: 'athlete password reset successfully' }));
      } catch (e) {
        console.error('server error updating the athlete\'s password: ', e);
        reject(serverFailure('Server error updating the athlete\'s password', e));
      }
    });
  });
}
