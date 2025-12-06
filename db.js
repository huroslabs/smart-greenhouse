// db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sensor_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL,
      humidity REAL,
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
