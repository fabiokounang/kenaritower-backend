"use strict";

const { getPool } = require("../utils/db");

async function getHotelProfile() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT hotel_name, tagline, phone, email, whatsapp,
            address, maps_embed_url, instagram, footer_about, updated_at
     FROM hotel_profile
     WHERE id = ?
     LIMIT ?`,
    [1, 1]
  );
  return rows[0] || null;
}

async function updateHotelProfile(payload) {
  const pool = getPool();

  const {
    hotel_name,
    tagline,
    phone,
    email,
    whatsapp,
    address,
    maps_embed_url,
    instagram,
    footer_about
  } = payload;

  const [result] = await pool.query(
    `UPDATE hotel_profile
     SET hotel_name = ?, tagline = ?, phone = ?, email = ?, whatsapp = ?,
         address = ?, maps_embed_url = ?, instagram = ?, footer_about = ?
     WHERE id = ?
     LIMIT ?`,
    [
      hotel_name,
      tagline,
      phone,
      email,
      whatsapp,
      address,
      maps_embed_url,
      instagram,
      footer_about,
      1,
      1
    ]
  );

  return result.affectedRows > 0;
}

module.exports = { getHotelProfile, updateHotelProfile };
