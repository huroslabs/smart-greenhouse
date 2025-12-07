const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const mqtt = require('mqtt');

const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MQTT Client connect ke broker lokal Mosquitto
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('sensor/data', (err) => {
    if (err) console.error(err);
    else console.log('Subscribed to topic sensor/data');
  });
});

client.on('message', (topic, message) => {
  if (topic === 'sensor/data') {
    try {
      const data = JSON.parse(message.toString());
      const { temperature, tds,  ph} = data;
      if (!temperature || !tds || !ph) {
        console.log("temperature, td & ph required!" );
      }
      
      if (typeof temperature === 'number' && typeof tds === 'number' && typeof ph === 'number') {
        db.run(
          'INSERT INTO sensor_data (temperature, tds, ph) VALUES (?, ?, ?)',
          [temperature, tds, ph],
          (err) => {
            if (err) console.error('DB Insert error:', err);
            else console.log(`Data saved: Temp=${temperature}, tds=${tds}, , ph=${ph}`);
          }
        );
      }
    } catch (e) {
      console.error('Invalid message format', e);
    }
  }
});


// =========== ENDPOINT REST ============

// Endpoint menampilkan data sensor terbaru
app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM sensor_data ORDER BY id ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ambil status semua tombol
app.get('/api/controls', (req, res) => {
  db.all(`SELECT name, status FROM controls`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update status tombol tertentu
app.post('/api/controls/:name', (req, res) => {
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

  client.publish('sensor/controls', payload, (err) => {
    if (err) {
      console.error("Publish error:", err);
      return res.status(500).json({ error: "Gagal publish" });
    }

    console.log("Published:", payload);
  });

  db.run(
    `UPDATE controls SET status = ? WHERE name = ?`,
    [status, name],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "button tidak ditemukan" });

      res.json({ message: `Status ${name} diupdate ke ${status}` });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
