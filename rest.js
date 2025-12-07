// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =========== ENDPOINT REST ============

// ESP kirim data
app.post('/api/data', (req, res) => {
  const { temperature, tds, ph} = req.body;

  if (!temperature || !tds || !ph) {
    return res.status(400).json({ error: "temperature, td & ph required" });
  }

  db.run(
    `INSERT INTO sensor_data (temperature, tds, ph) VALUES (?, ?, ?)`,
    [temperature, tds, ph],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "saved", id: this.lastID });
    }
  );
});

// Ambil semua data
app.get('/api/data', (req, res) => {
  db.all(`SELECT * FROM sensor_data ORDER BY id ASC`, (err, rows) => {
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

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});