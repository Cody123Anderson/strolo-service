const db = require('./database')
const { decodeToken } = require('../utils/jwt-token');
const config = require('../config');

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = decodeToken(token);
  const params = {
    TableName: config.TABLE_USER,
    Key: { 'email': decoded.sub }
  };

  db.get(params, (err, data) => {
    if (err) {
      console.error('Error in user isAuthenticated controller function: ', err);
      return res.status(500).send({ status: 500, error: err });
    }

    if (data.Item) {
      next();
    } else {
      return res.status(403).send('unauthorized');
    }
  });
};
