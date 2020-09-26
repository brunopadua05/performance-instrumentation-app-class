const express = require('express');
const requestPromise = require('request-promise');
const {default:got} = require('got/dist/source');
const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOSTNAME || 'localhost' ;
const url = `http://${host}:${port}`;

app.use(express.json());

async function requestRetry (maxRetryCount = 1) {
  
    const urlApi = `http://localhost:${3000}/`;
    return got(urlApi,{ retry: maxRetryCount });
  }
  
  // add retry inteligence route to express
  app.get('/retry', async (req, res) => {
    
    try {
      await  requestRetry();
      res.send('OK');
    } catch (err) {
      res.status(500).send('Erro na chamada da API A!');
    }
  });
  
  // start application server
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });