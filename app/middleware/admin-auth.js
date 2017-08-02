const { dynamo } = require('../services/database')
const { decodeToken } = require('../utils/jwt-token');
const config = require('../config');

exports.isAdminAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  const username = decodeToken(token).sub;
  const params = {
    TableName: config.TABLE_ADMIN,
    Key: { 'username': username }
  };

  dynamo.get(params, function(err, data) {
    if (err) {
      console.error('Error in isAuthenticated controller function: ', err);
      return res.status(500).send({ status: 500, error: err });
    }

    if (data.Item) {
      next();
    } else {
      return res.status(403).send('unauthorized');
    }
  });
};
