const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const enforce = require('express-sslify');

const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_NUMBER = process.env.TWILIO_NUMBER;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function messageSplitter(message) {
  const regex = /@(\w*)\s(.*)/;
  const [_, command, text] = message.match(regex);

  return { command, text };
}

app.post('/sms', ({ body: { Body, To } }) => {
  if (To !== ALLOWED_NUMBER) {
    return;
  }

  const { command, text } = messageSplitter(Body);

  switch (command) {
    case 'join':
      logger.info(`${command} has joined`);
      break;
    default:
  }
});

/**
 * Express server taking the place of the Ember dev server
 * Building of production files not handled here
 */
if (process.env.NODE_ENV === 'production') {
  // Upgrade to HTTPS 5ever
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/dist')));
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

app.listen(PORT, () => logger.debug('Party server is running'));
