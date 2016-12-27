module.exports.send = (email, cb) => {
  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var Client = require('sendgrid-rest').Client;
  var client = new Client();
  var request = client.emptyRequest();
  request.method = 'POST';
  request.headers['Authorization'] = ('Bearer ' + process.env.SENDGRID_API_KEY);
  request.path = '/v3/mail/send';
  request.body = email;
  sg.API(request, (err, response) => {
    cb(err, response);
  });
};
