import bcrypt from 'bcryptjs';

import * as constants from '../../constants';
import * as dynamoDbUtils from '../../utils/dynamo';
import { failure, serverFailure, success } from '../../utils/response';
import { getJWT } from '../../utils/jwt';
import { isLambdaWarmer } from '../../utils/warmer';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const data = JSON.parse(event.body);

    if (!data.email || !data.password) {
      console.error('Invalid Request: missing required params');
      return reject(failure(400, 'Invalid Request: missing required params'));
    }

    const queryParams = {
      TableName: constants.AWS.DYNAMO_USERS_TABLE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: dynamoDbUtils.getExpressionAttributeValues({
        email: data.email
      })
    };

    // Make sure user exists
    dynamoDbUtils.call('query', queryParams)
      .then(results => {
        console.info('query results: ', results);

        const user = results.Items[0];

        if (!user) {
          // email not found in our db
          return reject(failure(400, 'incorrect email/password combination'));
        }

        // Check if the password is correct
        bcrypt.compare(data.password, user.password || 'fail', (err, res) => {
          if (err) {
            console.error('error comparing the user\'s passwords: ', err.response);
            return reject(serverFailure('Server error verifying user\'s password in the database', err.response));
          }

          if (res) {
            // Passwords match
            // Delete the hashed password from the user obj so it's not returned to client
            delete user.password;

            return resolve(
              success({ token: getJWT(user, constants.JWT.TYPES.USER), user })
            );
          }

          // Passwords don't match
          return reject(failure(400, 'incorrect email/password combination'));
        });
      })
      .catch(err => {
        console.error('error querying for the user in the database: ', err.response);
        return reject(
          serverFailure('Server error querying for the user in the database', err.response)
        );
      });
  });
}
