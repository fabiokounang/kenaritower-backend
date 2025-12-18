"use strict";

const { getPool } = require("../utils/db");

async function getHeroImages() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, sort_order, image_path, alt_text, is_active
     FROM hero_images
     ORDER BY sort_order ASC
     LIMIT ?`,
    [200]
  );
  return rows;
}

async function insertHeroImage(payload) {
  const pool = getPool();
  const { sort_order, image_path, alt_text, is_active } = payload;

  const [result] = await pool.query(
    `INSERT INTO hero_images (sort_order, image_path, alt_text, is_active)
     VALUES (?, ?, ?, ?)`,
    [sort_order, image_path, alt_text, is_active]
  );

  return result.insertId;
}

async function updateHeroImage(id, payload) {
  const pool = getPool();

  const fields = [];
  const values = [];

  if (payload.sort_order !== undefined) { fields.push("sort_order = ?"); values.push(payload.sort_order); }
  if (payload.image_path) { fields.push("image_path = ?"); values.push(payload.image_path); }
  if (payload.alt_text !== undefined) { fields.push("alt_text = ?"); values.push(payload.alt_text); }
  if (payload.is_active !== undefined) { fields.push("is_active = ?"); values.push(payload.is_active); }

  if (!fields.length) return false;

  values.push(id, 1);

  const [result] = await pool.query(
    `UPDATE hero_images
     SET ${fields.join(", ")}
     WHERE id = ?
     LIMIT ?`,
    values
  );

  return result.affectedRows > 0;
}

async function deleteHeroImage(id) {
  const pool = getPool();

  const [result] = await pool.query(
    `DELETE FROM hero_images
     WHERE id = ?
     LIMIT ?`,
    [id, 1]
  );

  return result.affectedRows > 0;
}

module.exports = {
  getHeroImages,
  insertHeroImage,
  updateHeroImage,
  deleteHeroImage
};
