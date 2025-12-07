const Sensor = require('../models/sensor.model');

exports.createData = async (req, res) => {
  try {
    const data = await Sensor.create(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.CreateDataMQTT = async (topic, message) => {
  if (topic !== "sensor/data") return;

  try {
    const data = JSON.parse(message.toString());
    const { temperature, tds, ph } = data;

    if (temperature == null || tds == null || ph == null) {
      return console.log("temperature, tds, ph required!");
    }

    await Sensor.create(data);
    console.log("Saved from MQTT:", data);

  } catch (err) {
    console.error("MQTT error:", err);
  }
};

exports.getLatest = async (req, res) => {
  try {
    const data = await Sensor.getLatest();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Sensor.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
