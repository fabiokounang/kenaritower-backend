"use strict";

const { getHome, updateHome } = require("../models/home");

async function renderHomeCMS(req, res) {
  const data = await getHome();
  return res.render("admin/home", { user: req.user, data, saved: false, error: null });
}

async function saveHomeCMS(req, res) {
  try {
    const payload = {
      hero_title: String(req.body.hero_title || "").trim(),
      hero_subtitle: String(req.body.hero_subtitle || "").trim(),
      cta_text: String(req.body?.cta_text || "").trim(),
      cta_link: String(req.body.cta_link || "").trim()
    };
    
    if (!payload.hero_title) {
      const data = await getHome();
      return res.status(400).render("admin/home", {
        user: req.user,
        data,
        saved: false,
        error: "Hero title wajib diisi."
      });
    }

    const r = await updateHome(payload);
    console.log(r)
    const data = await getHome();

    return res.render("admin/home", { user: req.user, data, saved: true, error: null });
  } catch (e) {
    const data = await getHome();
    return res.status(500).render("admin/home", {
      user: req.user,
      data,
      saved: false,
      error: "Gagal simpan. Coba lagi."
    });
  }
}

module.exports = { renderHomeCMS, saveHomeCMS };
