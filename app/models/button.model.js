const db = require('../config/db');

exports.update = (name, status) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE controls SET status = ? WHERE name = ?
    `;

    db.run(query, [status, name], function (err) {
      if (err) return reject(err);
      resolve({updated: this.changes, name, status });
    });
  });
};

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT name, status FROM controls`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};