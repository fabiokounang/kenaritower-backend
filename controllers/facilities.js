"use strict";

const Facilities = require("../models/facilities");

function safeStr(v) {
  return String(v ?? "").trim();
}

function safeInt(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

async function renderFacilities(req, res) {
  const items = await Facilities.listFacilities();
  return res.render("admin/facilities", {
    user: req.user,
    items,
    saved: false,
    error: null,
  });
}

async function addFacility(req, res) {
  try {
    const maxOrder = await Facilities.getMaxSortOrder();

    const icon = safeStr(req.body.icon);
    const title = safeStr(req.body.title);
    const subtitle = safeStr(req.body.subtitle);

    if (!icon || !title || !subtitle) {
      const items = await Facilities.listFacilities();
      return res.status(400).render("admin/facilities", {
        user: req.user,
        items,
        saved: false,
        error: "Icon, title, dan subtitle wajib diisi untuk menambah facility.",
      });
    }

    await Facilities.insertFacility({
      sort_order: maxOrder + 1,
      icon,
      title,
      subtitle,
      is_active: 1,
    });

    return res.redirect("/admin/facilities");
  } catch (e) {
    console.error(e);
    const items = await Facilities.listFacilities();
    return res.status(500).render("admin/facilities", {
      user: req.user,
      items,
      saved: false,
      error: "Gagal menambah facility.",
    });
  }
}

async function saveFacilities(req, res) {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    for (const it of items) {
      const id = safeInt(it.id, 0);
      if (!id) continue;

      await Facilities.updateFacility(id, {
        sort_order: safeInt(it.sort_order, 1),
        icon: safeStr(it.icon),
        title: safeStr(it.title),
        subtitle: safeStr(it.subtitle),
        is_active: safeInt(it.is_active, 0) ? 1 : 0,
      });
    }

    const updated = await Facilities.listFacilities();
    return res.render("admin/facilities", {
      user: req.user,
      items: updated,
      saved: true,
      error: null,
    });
  } catch (e) {
    console.error(e);
    const items = await Facilities.listFacilities();
    return res.status(500).render("admin/facilities", {
      user: req.user,
      items,
      saved: false,
      error: "Gagal menyimpan facilities.",
    });
  }
}

async function deleteFacility(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.redirect("/admin/facilities");

    await Facilities.deleteFacility(id);
    return res.redirect("/admin/facilities");
  } catch (e) {
    console.error(e);
    return res.redirect("/admin/facilities");
  }
}

module.exports = {
  renderFacilities,
  addFacility,
  saveFacilities,
  deleteFacility,
};
