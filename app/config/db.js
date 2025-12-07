// db.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../database/data.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('DB Error:', err.message);
  console.log('SQLite connected');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sensor_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL,
      tds REAL,
      ph REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS controls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      status INTEGER DEFAULT 0
    )
  `);

  // Inisialisasi 2 tombol jika belum ada
  db.run(`INSERT OR IGNORE INTO controls (name, status) VALUES ('button1', 0)`);
  db.run(`INSERT OR IGNORE INTO controls (name, status) VALUES ('button2', 0)`);

});

module.exports = db;
