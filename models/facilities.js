"use strict";

const { getPool } = require("../utils/db");

async function getFacilities() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, sort_order, icon, title, subtitle, is_active
     FROM facilities
     ORDER BY sort_order ASC
     LIMIT ?`,
    [50]
  );
  return rows;
}

async function updateFacility(id, payload) {
  const pool = getPool();

  const fields = [];
  const values = [];

  if (payload.sort_order !== undefined) {
    fields.push("sort_order = ?");
    values.push(payload.sort_order);
  }
  if (payload.icon !== undefined) {
    fields.push("icon = ?");
    values.push(payload.icon);
  }
  if (payload.title !== undefined) {
    fields.push("title = ?");
    values.push(payload.title);
  }
  if (payload.subtitle !== undefined) {
    fields.push("subtitle = ?");
    values.push(payload.subtitle);
  }
  if (payload.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(payload.is_active);
  }

  if (!fields.length) return false;

  values.push(id, 1);

  const [result] = await pool.query(
    `UPDATE facilities
     SET ${fields.join(", ")}
     WHERE id = ?
     LIMIT ?`,
    values
  );

  return result.affectedRows > 0;
}

module.exports = {
  getFacilities,
  updateFacility
};
