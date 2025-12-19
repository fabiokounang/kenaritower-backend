"use strict";

const { getPool } = require("../utils/db");

async function getAbout() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, title, description, image_path
     FROM about
     WHERE id = ?
     LIMIT ?`,
    [1, 1]
  );
  return rows[0] || null;
}

async function updateAbout(payload) {
  const pool = getPool();
  await pool.query(
    `UPDATE about
     SET title = ?, description = ?, image_path = ?
     WHERE id = ?
     LIMIT ?`,
    [
      payload.title,
      payload.description,
      payload.image_path,
      1,
      1
    ]
  );
}

module.exports = {
  getAbout,
  updateAbout
};
