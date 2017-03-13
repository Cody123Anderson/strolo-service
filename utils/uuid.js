const getTimestamp = require('./timestamp').getTimestamp;

module.exports = (identifier) => {
  const timestamp = getTimestamp();
  const randomString = getRandomString();
  const id = `${identifier}-${timestamp}-${randomString}`;

  return id;
}

function getRandomString() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
