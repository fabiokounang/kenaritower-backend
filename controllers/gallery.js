"use strict";

const {
  getGalleryItems,
  updateGalleryItem
} = require("../models/gallery");

async function renderGallery(req, res) {
  const items = await getGalleryItems();
  res.render("admin/gallery-list", {
    user: req.user,
    items,
    saved: false,
    error: null
  });
}

async function saveGallery(req, res) {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const files = req.files || [];

    // map file upload: image_<id> => path
    const fileMap = {};
    for (const file of files) {
      const match = file.fieldname.match(/^image_(\d+)$/);
      if (match) {
        fileMap[match[1]] = `/uploads/gallery/${file.filename}`;
      }
    }

    for (const item of items) {
      const id = Number(item.id);
      if (!id) continue;

      const payload = {
        sort_order: Number(item.sort_order) || 1,
        alt_text: String(item.alt_text || "").trim(),
        overlay_label: String(item.overlay_label || "").trim(),
        title: String(item.title || "").trim(),
        description: String(item.description || "").trim(),
        is_active: Number(item.is_active) ? 1 : 0
      };

      // upload optional
      if (fileMap[id]) {
        payload.image_path = fileMap[id];
      }

      await updateGalleryItem(id, payload);
    }

    const updated = await getGalleryItems();
    res.render("admin/gallery-list", {
      user: req.user,
      items: updated,
      saved: true,
      error: null
    });

  } catch (err) {
    console.error(err);
    const items = await getGalleryItems();
    res.status(500).render("admin/gallery-list", {
      user: req.user,
      items,
      saved: false,
      error: "Gagal menyimpan gallery"
    });
  }
}

module.exports = {
  renderGallery,
  saveGallery
};
