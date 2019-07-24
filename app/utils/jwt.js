import jwt from 'jwt-simple';

import * as constants from '../constants';
import { getTimestampForXDaysInFuture, getCurrentTimestamp } from './time';

export function getAthleteJWT(athlete) {
  // expiration date is 30 days from today
  const payload = {
    sub: athlete.athleteId,
    email: athlete.email,
    type: constants.USER_TYPES.ATHLETE,
    iat: getCurrentTimestamp(),
    exp: getTimestampForXDaysInFuture(30)
  };

  return jwt.encode(payload, constants.JWT.SECRET);
}

export function decode(token) {
  return jwt.decode(token, constants.JWT.SECRET);
}
