const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOSTNAME || 'localhost' ;
const url = `http://${host}:${port}`;

process.env.APP_NAME = "index-A";
const newrelic = require('newrelic');

app.use(express.json());
 
// add root route to express
app.get('/', (req, res) => {
  console.log('OK');
  res.send('OK');
});

// add root route to express
app.get('/error', (req, res) => {
  res.status(500).send('Something broke!');
});

// start application server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});