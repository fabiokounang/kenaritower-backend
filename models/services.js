"use strict";
const { getPool } = require("../utils/db");

async function listServices() {
  const pool = getPool();
  const [rows] = await pool.query(
    `
    SELECT id, title, description, sort_order, is_active
    FROM services
    ORDER BY sort_order ASC
    LIMIT ?
    `,
    [100]
  );
  return rows;
}

async function insertService({ title, description }) {
  const pool = getPool();
  await pool.query(
    `
    INSERT INTO services (title, description, sort_order, is_active)
    VALUES (?, ?, ?, ?)
    `,
    [title, description, 999, 1]
  );
}

async function updateService(id, payload) {
  const pool = getPool();
  await pool.query(
    `
    UPDATE services
    SET title = ?, description = ?, sort_order = ?, is_active = ?
    WHERE id = ?
    LIMIT ?
    `,
    [
      payload.title,
      payload.description,
      payload.sort_order,
      payload.is_active,
      id,
      1
    ]
  );
}

async function deleteService(id) {
  const pool = getPool();
  await pool.query(
    `
    DELETE FROM services
    WHERE id = ?
    LIMIT ?
    `,
    [id, 1]
  );
}

module.exports = {
  listServices,
  insertService,
  updateService,
  deleteService
};
