const { User, Idea } = require('../models');
const { decodeToken } = require('../utils/jwt-token');

exports.isUserAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  const email = decodeToken(token).sub;

  User.findOne({
    where: { email },
    include: [{ model: Idea, as: 'favorites', through: { attributes: [] } }]
  }).then(user => {
    if (user) {
      req.user = user;

      next();
    } else {
      return res.status(403).send('unauthorized');
    }
  }).catch(err => {
    console.error('Error in user isAuthenticated controller function: ', err);

    return res.status(500).send({ status: 500, error: err });
  });
};

exports.isMatchingUser = (req, res, next) => {
  const authenticatedUserId = req.user.id;
  const suppliedUserId = req.params.userId;

  if (authenticatedUserId === suppliedUserId) {
    next();
  } else {
    console.error(`authenticatedUserId ${authenticatedUserId} does not match the suppliedUserId ${suppliedUserId}`);
    return res.status(403).send('unauthorized');
  }
};
