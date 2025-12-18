"use strict";

const { getPool } = require("../utils/db");

async function findByEmail(email) {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT id, email, password_hash, role, is_active FROM users WHERE email = ? LIMIT ?`, [email, 1]);
  return rows[0] || null;
}

module.exports = { findByEmail };
