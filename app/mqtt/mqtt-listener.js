const client = require('./mqtt-client');
const sensorController = require('../controllers/sensor.controller');

client.on('message', (topic, message) => {
  if (topic === "sensor/data") {
    sensorController.CreateDataMQTT(topic, message);
  }
});
