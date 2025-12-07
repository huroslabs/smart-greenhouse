const express = require('express');
const cors = require('cors');
const db = require('./app/config/db');
const path = require('path');

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sensor = require('./app/controllers/sensor.controller');
const button = require('./app/controllers/button.controller');

require('./app/mqtt/mqtt-listener'); 

// =========== ENDPOINT REST ============
app.get('/api/data', sensor.getAll);

app.get('/api/controls', button.getAll);
app.post('/api/controls/:name', button.UpdateDataMQTT);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
