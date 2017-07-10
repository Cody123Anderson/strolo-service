var axios = require('axios');

const config = require('../config')

module.exports = (body, cb) => {
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.SENDGRID_API_KEY
    }
  };
  axios.post('https://api.sendgrid.com/v3/contactdb/recipients', body, headers)
  .then((res) => {
    const recipientId = res.data.persisted_recipients[0];
    axios.post(
      `https://api.sendgrid.com/v3/contactdb/lists/${config.SENDGRID_LIST_ID}/recipients/${recipientId}`,
      null,
      headers
    )
    .then(() => {
      cb();
    })
    .catch((error) => {
      cb(error);
    });
  })
  .catch((err) => {
    cb(err);
  });
};
