const jwt = require('jwt-simple');

const config = require('../config');
const { getTimestamp } = require('./timestamp');

exports.encodeAdminToken = (user) => {
  const expiration = getTimestamp() + (60 * 60 * 24 * 7); // 7 days

  return jwt.encode({
    sub: user.username,
    username: user.username,
    iat: user.creationDate,
    exp: expiration
  }, config.JWT_SECRET);
}

exports.encodeUserToken = (user) => {
  const expiration = getTimestamp() + (60 * 60 * 24 * 7); // 7 days

  return jwt.encode({
    sub: user.email,
    email: user.email,
    iat: user.creationDate,
    exp: expiration
  }, config.JWT_SECRET);
}

exports.decodeToken = (token) => {
  return jwt.decode(token, config.JWT_SECRET);
}
