"use strict";

const { getPool } = require("../utils/db");

async function getGalleryItems() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, sort_order, image_path, overlay_label, title, is_active
     FROM gallery_items
     ORDER BY sort_order ASC
     LIMIT ?`,
    [500]
  );
  return rows;
}

async function getGalleryItemById(id) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, sort_order, image_path, alt_text, overlay_label, title, description, is_active
     FROM gallery_items
     WHERE id = ?
     LIMIT ?`,
    [id, 1]
  );
  return rows[0] || null;
}

async function insertGalleryItem(payload) {
  const pool = getPool();
  const { sort_order, image_path, alt_text, overlay_label, title, description, is_active } = payload;

  const [result] = await pool.query(
    `INSERT INTO gallery_items
     (sort_order, image_path, alt_text, overlay_label, title, description, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [sort_order, image_path, alt_text, overlay_label, title, description, is_active]
  );

  return result.insertId;
}

async function updateGalleryItem(id, payload) {
  const pool = getPool();

  const fields = [];
  const values = [];

  if (payload.sort_order !== undefined) { fields.push("sort_order = ?"); values.push(payload.sort_order); }
  if (payload.image_path) { fields.push("image_path = ?"); values.push(payload.image_path); }
  if (payload.alt_text !== undefined) { fields.push("alt_text = ?"); values.push(payload.alt_text); }
  if (payload.overlay_label !== undefined) { fields.push("overlay_label = ?"); values.push(payload.overlay_label); }
  if (payload.title !== undefined) { fields.push("title = ?"); values.push(payload.title); }
  if (payload.description !== undefined) { fields.push("description = ?"); values.push(payload.description); }
  if (payload.is_active !== undefined) { fields.push("is_active = ?"); values.push(payload.is_active); }

  if (!fields.length) return false;

  values.push(id, 1);

  const [result] = await pool.query(
    `UPDATE gallery_items
     SET ${fields.join(", ")}
     WHERE id = ?
     LIMIT ?`,
    values
  );

  return result.affectedRows > 0;
}

async function deleteGalleryItem(id) {
  const pool = getPool();
  const [result] = await pool.query(
    `DELETE FROM gallery_items
     WHERE id = ?
     LIMIT ?`,
    [id, 1]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getGalleryItems,
  getGalleryItemById,
  insertGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
