const Button = require('../models/button.model');
const client = require('../mqtt/mqtt-client'); 

exports.UpdateData = async (req, res) => {
  try {
    const { name } = req.params;
    const { status } = req.body;

    if (status !== 0 && status !== 1) {
        return res.status(400).json({ error: "status harus 0 atau 1" });
    }

    const data = await Button.update(name, status);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.UpdateDataMQTT = async (req, res) => {
  try {
    const { name } = req.params;
    const { status } = req.body;

    if (status !== 0 && status !== 1) {
        return res.status(400).json({ error: "status harus 0 atau 1" });
    }

    // Payload
    const payload = JSON.stringify({
        name: name,
        status: status
    });

    // Publish MQTT (async manual)
    await new Promise((resolve, reject) => {
      client.publish('sensor/controls', payload, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const data = await Button.update(name, status);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Button.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};