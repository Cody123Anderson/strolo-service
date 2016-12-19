var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var settings = require('./config/settings');
var routes = require('./routes/index');

//Load settings into node environment
settings.loadEnv(process.env);

var port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '20mb' })); // increases max file size
app.use(bodyParser.urlencoded({limit: '20mb', extended: true})); // increases max file size

// CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

routes(app);

app.listen(port, (err) => {
  if (err) console.error('Error starting server: ' + err);
  console.info('Running server on port: ' + port);
});
