"use strict";

const { getPool } = require("../utils/db");

async function listFacilities() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, sort_order, icon, title, subtitle, is_active
     FROM facilities
     ORDER BY sort_order ASC
     LIMIT ?`,
    [500]
  );
  return rows;
}

async function insertFacility(payload) {
  const pool = getPool();
  const [res] = await pool.query(
    `INSERT INTO facilities (sort_order, icon, title, subtitle, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [payload.sort_order, payload.icon, payload.title, payload.subtitle, payload.is_active]
  );
  return res.insertId;
}

async function updateFacility(id, payload) {
  const pool = getPool();

  const fields = [];
  const values = [];

  if (payload.sort_order !== undefined) { fields.push("sort_order = ?"); values.push(payload.sort_order); }
  if (payload.icon !== undefined) { fields.push("icon = ?"); values.push(payload.icon); }
  if (payload.title !== undefined) { fields.push("title = ?"); values.push(payload.title); }
  if (payload.subtitle !== undefined) { fields.push("subtitle = ?"); values.push(payload.subtitle); }
  if (payload.is_active !== undefined) { fields.push("is_active = ?"); values.push(payload.is_active); }

  if (!fields.length) return false;

  values.push(id, 1);

  const [res] = await pool.query(
    `UPDATE facilities
     SET ${fields.join(", ")}
     WHERE id = ?
     LIMIT ?`,
    values
  );

  return res.affectedRows > 0;
}

async function deleteFacility(id) {
  const pool = getPool();
  const [res] = await pool.query(
    `DELETE FROM facilities
     WHERE id = ?
     LIMIT ?`,
    [id, 1]
  );
  return res.affectedRows > 0;
}

async function getMaxSortOrder() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT COALESCE(MAX(sort_order), 0) AS max_order
     FROM facilities
     LIMIT ?`,
    [1]
  );
  return Number(rows?.[0]?.max_order || 0);
}

module.exports = {
  listFacilities,
  insertFacility,
  updateFacility,
  deleteFacility,
  getMaxSortOrder,
};
