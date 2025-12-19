"use strict";

const {
  getGalleryItems,
  getGalleryItemById,
  insertGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require("../models/gallery");

async function renderGalleryList(req, res) {
  const items = await getGalleryItems();
  res.render("admin/gallery-list", {
    user: req.user,
    items,
    saved: false,
    error: null
  });
}

async function addGalleryItem(req, res) {
  try {
    if (!req.file) {
      const items = await getGalleryItems();
      return res.status(400).render("admin/gallery-list", {
        user: req.user,
        items,
        saved: false,
        error: "Upload image dulu untuk menambah gallery item"
      });
    }

    const items = await getGalleryItems();
    const maxOrder = items.reduce((m, x) => Math.max(m, Number(x.sort_order) || 0), 0);

    const id = await insertGalleryItem({
      sort_order: Number(req.body.sort_order) || (maxOrder + 1),
      image_path: `/uploads/gallery/${req.file.filename}`,
      alt_text: String(req.body.alt_text || "").trim(),
      overlay_label: String(req.body.overlay_label || "").trim(),
      title: String(req.body.title || "").trim(),
      description: String(req.body.description || "").trim(),
      is_active: 1
    });

    return res.redirect("/admin/gallery");
  } catch (err) {
    console.error(err);
    const items = await getGalleryItems();
    return res.status(500).render("admin/gallery-list", {
      user: req.user,
      items,
      saved: false,
      error: "Gagal menambah gallery item"
    });
  }
}

async function renderGalleryDetail(req, res) {
  const id = Number(req.params.id);
  const item = await getGalleryItemById(id);
  if (!item) return res.status(404).send("Gallery item not found");

  res.render("admin/gallery-detail", {
    user: req.user,
    item,
    saved: false,
    error: null
  });
}

async function saveGalleryDetail(req, res) {
  const id = Number(req.params.id);

  try {
    const payload = {
      sort_order: Number(req.body.sort_order) || 1,
      overlay_label: String(req.body.overlay_label || "").trim(),
      title: String(req.body.title || "").trim(),
      description: String(req.body.description || "").trim(),
      alt_text: String(req.body.alt_text || "").trim(),
      is_active: Number(req.body.is_active) ? 1 : 0
    };

    if (req.file) {
      payload.image_path = `/uploads/gallery/${req.file.filename}`;
    }

    await updateGalleryItem(id, payload);

    const item = await getGalleryItemById(id);
    res.render("admin/gallery-detail", {
      user: req.user,
      item,
      saved: true,
      error: null
    });
  } catch (err) {
    console.error(err);
    const item = await getGalleryItemById(id);
    res.status(500).render("admin/gallery-detail", {
      user: req.user,
      item,
      saved: false,
      error: "Gagal menyimpan gallery detail"
    });
  }
}

async function removeGalleryItem(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.redirect("/admin/gallery");

    await deleteGalleryItem(id);
    return res.redirect("/admin/gallery");
  } catch (err) {
    console.error(err);
    return res.redirect("/admin/gallery");
  }
}

module.exports = {
  renderGalleryList,
  addGalleryItem,
  renderGalleryDetail,
  saveGalleryDetail,
  removeGalleryItem
};
