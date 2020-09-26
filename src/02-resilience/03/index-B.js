const express = require('express');
const requestPromise = require('request-promise');
const {default:got} = require('got/dist/source');
const CircuitBreaker = require('opossum');
const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOSTNAME || 'localhost' ;
const url = `http://${host}:${port}`;
const CircuitBreaker = require('opossum');

const CircuitBreakerOptions = {
    timeout: 5000,
    errorThresholdPercentage: 10,
    resetTimeout: 10000
}

const breaker = new CircuitBreaker(requestApi, CircuitBreakerOptions);
breaker.on('open', () => console.log(`OPEN: The breaker`));
breaker.on('halfOpen', () => console.log(`HALF_OPEN: The breaker`));
breaker.on('close', () => console.log(`CLOSE: The breaker`));

breaker.fallback(() => console.log('called fallback'));

app.use(express.json());

async function requestApi (maxRetryCount = 1) {
    const urlApi = `http://localhost:${3000}/`;
    return got(urlApi,{ retry: maxRetryCount });
  }
  
  // add retry inteligence route to express
  app.get('/circuitbreaker', async (req, res) => {
    
    try {
      await  requestApi();
      res.send('OK');
    } catch (err) {
      res.status(500).send('Erro na chamada da API A!');
    }
  });
  
  // start application server
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });