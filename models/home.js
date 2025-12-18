"use strict";

const { getPool } = require("../utils/db");


async function getHome() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, hero_title, hero_subtitle, cta_text, cta_link, updated_at
     FROM cms_home
     WHERE id = ?
     LIMIT ?`,
    [1, 1]
  );
  return rows[0] || null;
}

async function updateHome(payload) {
  const pool = getPool();
  const { hero_title, hero_subtitle, cta_text, cta_link } = payload;

  const [result] = await pool.query(
    `UPDATE cms_home
     SET hero_title = ?, hero_subtitle = ?, cta_text = ?, cta_link = ?
     WHERE id = ?
     LIMIT ?`,
    [hero_title, hero_subtitle, cta_text, cta_link, 1, 1]
  );

  return result.affectedRows > 0;
}

module.exports = { getHome, updateHome };
