const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./app/config');
const routes = require('./app/routes/index');

// Configure port
const port = config.PORT || 3000;

// Set up logging
app.use(morgan('combined'));

// increases max file size for images up to 16mb
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// CORS configuration
app.use(cors());

// Load routes into application
routes(app);

// 404 routes
app.get('*', function(req, res){
  res.send({ statusCode: 404, error: 'Route not found' });
});

app.put('*', function(req, res){
  res.send({ statusCode: 404, error: 'Route not found' });
});

app.post('*', function(req, res){
  res.send({ statusCode: 404, error: 'Route not found' });
});

app.delete('*', function(req, res){
  res.send({ statusCode: 404, error: 'Route not found' });
});

app.listen(port, (err) => {
  if (err) console.error('Error starting server: ' + err);
  console.info('Running server on port: ' + port);
  console.info('Running in environment: ' + config.NODE_ENV);
});
