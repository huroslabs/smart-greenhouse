const db = require('../config/db');

exports.create = (data) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO sensor_data (ph, tds, temperature)
      VALUES (?, ?, ?)
    `;
    db.run(query, [data.ph, data.tds, data.temperature], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, ...data });
    });
  });
};

exports.getLatest = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM sensor_data
      ORDER BY id DESC LIMIT 1
    `;
    db.get(query, [], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM sensor_data ORDER BY id ASC`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};