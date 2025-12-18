"use strict";

const {
  getFacilities,
  updateFacility
} = require("../models/facilities");

async function renderFacilities(req, res) {
  const facilities = await getFacilities();
  res.render("admin/facilities", {
    user: req.user,
    facilities,
    saved: false,
    error: null
  });
}

async function saveFacilities(req, res) {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    for (const item of items) {
      const id = Number(item.id);
      if (!id) continue;

      await updateFacility(id, {
        sort_order: Number(item.sort_order) || 1,
        icon: String(item.icon || "").trim(),
        title: String(item.title || "").trim(),
        subtitle: String(item.subtitle || "").trim(),
        is_active: Number(item.is_active) ? 1 : 0
      });
    }

    const facilities = await getFacilities();
    res.render("admin/facilities", {
      user: req.user,
      facilities,
      saved: true,
      error: null
    });

  } catch (err) {
    console.error(err);
    const facilities = await getFacilities();
    res.status(500).render("admin/facilities", {
      user: req.user,
      facilities,
      saved: false,
      error: "Gagal menyimpan facilities"
    });
  }
}

module.exports = {
  renderFacilities,
  saveFacilities
};
