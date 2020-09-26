
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOSTNAME || 'localhost' ;
const url = `http://${host}:${port}`;
const log = require('./log');
const newrelic = require('newrelic');

process.env.APP_NAME = "index-A";

app.use(express.json());
 
// add root route to express
app.get('/', (req, res) => {
  log.info('OK')
  res.send('OK');
});

// add root route to express
app.get('/error', (req, res) => {
  log.error('Erro no API!')
  res.status(500).send('Erro no API!');
});

// start application server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});