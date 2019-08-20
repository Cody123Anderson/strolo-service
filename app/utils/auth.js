import _ from 'lodash';
import axios from 'axios';

import { STROLO_SERVICE_API_KEY, JWT, API_URL } from '../constants';
import { failure } from './response';
import { decode } from './jwt';
import { getInternalRequestOptions } from './request';
import { parseBody } from './format-data';

function finishProcesses() {
  return new Promise((resolve) => {
    setTimeout(() => { resolve(true); });
  });
}

async function deny(statusCode, reason, parentReject) {
  console.info(`${reason}!`);
  parentReject(failure(statusCode, reason));

  const processesFinished = await finishProcesses();

  if (processesFinished) process.exit(0);
}

/*
  * Check if a role is a required and if the user meets that role criteria
*/
function hasValidRole(acceptedRoles, role) {
  if (!acceptedRoles.length || (_.indexOf(acceptedRoles, role) > -1)) {
    return true;
  }

  return false;
}

/*
  * event: object - lambda event
  * reject: func - reject function from lambda to responsd to request if it fails
  * type: string - type of the JWT (required if JWT auth is allowed)
  * acceptedRoles: array - accepted user roles to be authenticated (required if JWT auth is allowed)
*/
export async function requireAuth(event, parentReject, type = 'Invalid', acceptedRoles = []) {
  return new Promise(async (resolve) => {
    console.info('event: ', event);
    console.info('type: ', type);
    console.info('acceptedRoles: ', acceptedRoles);

    const stroloServiceAPIKey = _.get(event, 'headers[\'Strolo-Service-API-Key\']');
    const token = _.get(event, 'headers.Authorization');
    const body = parseBody(event.body || {});

    console.log('body: ', body);

    if (stroloServiceAPIKey) {
      // Strolo-Service-API-Key check
      if (stroloServiceAPIKey === STROLO_SERVICE_API_KEY) {
        console.info('Is a valid Strolo Service API key!');
        return resolve();
      }

      // Invalid Strolo Service API Key
      deny(401, 'Invalid Strolo Service API key', parentReject);
    } else if (token) {
      // JWT Check
      try {
        if (!token.includes('Bearer')) {
          deny(401, 'Authorization header is missing "Bearer" before token', parentReject);
        }

        // Get decoded token and verify signature
        const decodedToken = decode(token.substring(7));

        if (decodedToken) {
          console.info('decodedToken: ', decodedToken);

          // Check if token is expired
          if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
            deny(401, 'Your JWT token has expired', parentReject);
          }

          // Check if user has necessary permissions
          if (decodedToken.type === JWT.TYPES.STROLO_ADMIN) {
            console.info('Is a valid Strolo Admin!');
            return resolve();
          } else if (decodedToken.type === type && type === JWT.TYPES.SPONSOR_ADMIN) {
            console.info('Is a Sponsor Admin!');
            const requestSponsorAdminId = _.get(event, 'pathParameters.sponsorAdminId') || _.get(event, 'queryStringParameters.sponsorAdminId') || _.get(event, 'body.sponsorAdminId');
            let requestSponsorId = _.get(event, 'pathParameters.sponsorId') || _.get(event, 'queryStringParameters.sponsorId') || _.get(event, 'body.sponsorId');

            if (requestSponsorAdminId && requestSponsorAdminId === decodedToken.sub) {
              // SponsorAdmin making request is accessing/altering their own data
              console.info('Is a valid Sponsor Admin!');
              return resolve();
            } else if (requestSponsorId && requestSponsorId === decodedToken.sponsorId) {
              // SponsorAdmin making request is trying to access/alter data on sponsorAdmin within their sponsor account
              if (hasValidRole(acceptedRoles, decodedToken.role)) {
                // SponsorAdmin's role is sufficient enough to make this request
                console.info('Is a valid Sponsor Admin - Completed Role Check!');
                return resolve();
              }

              deny(403, 'Insufficient role to carry out this operation', parentReject);
            } else if (requestSponsorAdminId && !requestSponsorId) {
              try {
                const options = getInternalRequestOptions();
                const requestUrl = `${API_URL}/sponsorAdmins/sponsorAdmin?sponsorAdminId=${requestSponsorAdminId}`;
                const { data } = await axios.get(requestUrl, options);

                console.info('data: ', data);

                requestSponsorId = _.get(data, 'sponsorAdmin.sponsorId', 'notfound');
              } catch (e) {
                console.error('server error getting sponsorAdmin: ', e);
                return deny(500, 'server error getting sponsorAdmin', parentReject);
              }

              if (decodedToken.sponsorId === requestSponsorId) {
                // SponsorAdmin making request is trying to access/alter data on sponsorAdmin within their sponsor account
                if (hasValidRole(acceptedRoles, decodedToken.role)) {
                  // SponsorAdmin's role is sufficient enough to make this request
                  return resolve();
                }

                deny(403, 'Insufficient role to carry out this operation', parentReject);
              } else {
                deny(403, 'Insufficient permissions to access accounts other than your own', parentReject);
              }
            } else {
              deny(403, 'Insufficient permissions to access accounts other than your own', parentReject);
            }
          } else if (decodedToken.type === type && type === JWT.TYPES.ATHLETE) {
            console.info('Is an Athlete!');

            const requestAthleteId = decodeURIComponent(_.get(event, 'pathParameters.athleteId') || _.get(event, 'queryStringParameters.athleteId') || _.get(body, 'athleteId'));
            const requestEmail = decodeURIComponent(_.get(event, 'pathParameters.email') || _.get(event, 'queryStringParameters.email') || _.get(body, 'email'));

            if (requestAthleteId && requestAthleteId === decodedToken.sub) {
              // Athlete making request is accessing/altering their own data
              console.info('Is a valid Athlete - athleteId check!');
              return resolve();
            } else if (requestEmail && requestEmail === decodedToken.email) {
              // Athlete making request is accessing/altering their own data
              console.info('Is a valid Athlete - email check!');
              return resolve();
            }

            deny(403, 'Insufficient permissions to access accounts other than your own', parentReject);
          } else {
            deny(403, 'Unknown JWT type', parentReject);
          }
        } else {
          deny(401, 'Invalid JWT', parentReject);
        }
      } catch (e) {
        console.error('error decoding token: ', e);
        deny(401, 'JWT is not valid or has expired', parentReject);
      }
    } else {
      // No Authentication method found
      deny(401, 'Unauthorized!', parentReject);
    }
  });
}
