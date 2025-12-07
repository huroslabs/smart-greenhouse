// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sensor = require('./app/controllers/sensor.controller');
const button = require('./app/controllers/button.controller');

// =========== ENDPOINT REST ============
app.post('/api/data', sensor.createData);
app.get('/api/data', sensor.getAll);
app.get('/api/data/latest', sensor.getLatest);

app.get('/api/controls', button.getAll);
app.post('/api/controls/:name', button.UpdateData);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});