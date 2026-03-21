const express = require('express');
const client = require('prom-client');

const app = express();
const port = 3000;

// 기본 메트릭 수집
client.collectDefaultMetrics();

// 커스텀 메트릭
const counter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of requests'
});

app.get('/', (req, res) => {
  counter.inc();
  res.send('Hello DevOps!');
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
