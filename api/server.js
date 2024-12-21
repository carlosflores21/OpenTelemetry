require('./tracing');
const express = require('express');
const axios = require('axios');
const app = express();

const port = 3000;

// Root
app.get('/', (req, res) => {
  res.send('Hi OpenTelemetry');
});

// Alter
app.get('/alter', (req, res) => {
  res.send('Alter OpenTelemetry');
});


app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});