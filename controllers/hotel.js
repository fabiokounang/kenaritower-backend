"use strict";

const { getHotelProfile, updateHotelProfile } = require("../models/hotel_profile");

async function renderHotelProfile(req, res) {
  const data = await getHotelProfile();
  return res.render("admin/hotel", { user: req.user, data, saved: false, error: null });
}

async function saveHotelProfile(req, res) {
  try {
    const payload = {
      hotel_name: String(req.body.hotel_name || "").trim(),
      tagline: String(req.body.tagline || "").trim(),
      phone: String(req.body.phone || "").trim(),
      email: String(req.body.email || "").trim(),
      whatsapp: String(req.body.whatsapp || "").trim(),
      address: String(req.body.address || "").trim(),
      maps_embed_url: String(req.body.maps_embed_url || "").trim(),
      instagram: String(req.body.instagram || "").trim(),
      footer_about: String(req.body.footer_about || "").trim()
    };


    if (!payload.hotel_name) {
      const data = await getHotelProfile();
      return res.status(400).render("admin/hotel", { user: req.user, data, saved: false, error: "Hotel name wajib.", });
    }

    await updateHotelProfile(payload);
    const data = await getHotelProfile();
    return res.render("admin/hotel", { user: req.user, data, saved: true, error: null });
  } catch (e) {
    const data = await getHotelProfile();
    return res.status(500).render("admin/hotel", { user: req.user, data, saved: false, error: "Gagal simpan. Coba lagi." });
  }
}

module.exports = { renderHotelProfile, saveHotelProfile };
