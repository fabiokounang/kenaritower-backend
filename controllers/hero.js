"use strict";

const {
  getHeroImages,
  insertHeroImage,
  updateHeroImage,
  deleteHeroImage
} = require("../models/hero_images");

function buildFileMap(files, folder) {
  const map = {};
  for (const f of (files || [])) {
    const m = f.fieldname.match(/^image_(\d+)$/);
    if (m) map[m[1]] = `/uploads/${folder}/${f.filename}`;
  }
  return map;
}

async function renderHeroImages(req, res) {
  const images = await getHeroImages();
  res.render("admin/hero-images", { user: req.user, images, saved: false, error: null });
}

async function saveHeroImages(req, res) {
  try {
    const images = Array.isArray(req.body.images) ? req.body.images : [];
    const fileMap = buildFileMap(req.files, "hero");

    for (const img of images) {
      const id = Number(img.id);
      if (!id) continue;

      const payload = {
        sort_order: Number(img.sort_order) || 1,
        alt_text: String(img.alt_text || "").trim(),
        is_active: Number(img.is_active) ? 1 : 0
      };

      if (fileMap[id]) payload.image_path = fileMap[id];

      await updateHeroImage(id, payload);
    }

    const updated = await getHeroImages();
    res.render("admin/hero-images", { user: req.user, images: updated, saved: true, error: null });
  } catch (e) {
    console.error(e);
    const images = await getHeroImages();
    res.status(500).render("admin/hero-images", { user: req.user, images, saved: false, error: "Gagal menyimpan hero images" });
  }
}

async function addHeroImage(req, res) {
  try {
    if (!req.file) {
      const images = await getHeroImages();
      return res.status(400).render("admin/hero-images", { user: req.user, images, saved: false, error: "Upload image dulu untuk menambah slide" });
    }

    const images = await getHeroImages();
    const maxOrder = images.reduce((m, x) => Math.max(m, Number(x.sort_order) || 0), 0);

    await insertHeroImage({
      sort_order: maxOrder + 1,
      image_path: `/uploads/hero/${req.file.filename}`,
      alt_text: String(req.body.alt_text || "").trim(),
      is_active: 1
    });

    return res.redirect("/admin/hero-images");
  } catch (e) {
    console.error(e);
    const images = await getHeroImages();
    res.status(500).render("admin/hero-images", { user: req.user, images, saved: false, error: "Gagal menambah hero slide" });
  }
}

async function removeHeroImage(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.redirect("/admin/hero-images");

    await deleteHeroImage(id);
    return res.redirect("/admin/hero-images");
  } catch (e) {
    console.error(e);
    return res.redirect("/admin/hero-images");
  }
}

module.exports = {
  renderHeroImages,
  saveHeroImages,
  addHeroImage,
  removeHeroImage
};
