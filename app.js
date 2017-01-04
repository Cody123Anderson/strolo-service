const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const settings = require('./config/settings');
const routes = require('./routes/index');

//Load settings into node environment
settings.loadEnv(process.env);

const port = process.env.PORT || 3000;

// Set up logging
app.use(morgan('combined'));

// increases max file size
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

//Configure mongodb
mongoose.connect(process.env.MONGO_HOST || process.env.MONGO_TEST_URL);

// CORS configuration
app.use(cors());

routes(app);

app.listen(port, (err) => {
  if (err) console.error('Error starting server: ' + err);
  console.info('Running server on port: ' + port);
});
