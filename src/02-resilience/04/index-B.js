const express = require('express');
const requestPromise = require('request-promise');
const { default: got } = require('got/dist/source');
const CircuitBreaker = require('opossum');
const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOSTNAME || 'localhost';
const url = `http://${host}:${port}`;
const CircuitBreaker = require('opossum');
const redis = require('redis');
const client = redis.createClient({ host: '127.0.0.1', port: 6379 });
const redisSetPromise = util.promisify(client.set).bind(client);
const redisGetPromise = util.promisify(client.get).bind(client);
const REDISCACHEKEY = "get-api";

const CircuitBreakerOptions = {
  timeout: 5000,
  errorThresholdPercentage: 10,
  resetTimeout: 10000
}

const breaker = new CircuitBreaker(requestApi, CircuitBreakerOptions);
breaker.on('open', () => console.log(`OPEN: The breaker`));
breaker.on('halfOpen', () => console.log(`HALF_OPEN: The breaker`));
breaker.on('close', () => console.log(`CLOSE: The breaker`));

async function requestFallbackRedis() {
  let response = "OK fallback";
  try {
    const responseRedis = await redisGetPromise(REDISCACHEKEY);
    if (responseRedis) {
      response = JSON.parse(responseRedis);
    }
  } catch (err) {
    console.error('Error to get cache in Redis => ', err);
  }
  return response;
}

breaker.fallback(requestFallbackRedis);

app.use(express.json());

async function requestApi(maxRetryCount = 1) {
  const urlApi = `http://localhost:${3000}/`;
  const { body } = await got(urlApi, { retry: maxRetryCount })
    try {
      await redisSetPromise(REDISCACHEKEY, JSON.stringify(body));
    } catch (err) {
      console.log("Erro ao salvar informações no cache do redis")
    }
    return body;
}
    async function requestWithCb() {
      return breaker.fire();
}

// add cache inteligence route to express   
app.get('/cache', async (req, res) => {
  try {
    const response = await requestWithCb();
    res.send(response);
  } catch (err) {
    res.status(500).send('Something broke!');
  }
});

// start application server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});