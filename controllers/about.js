"use strict";

const About = require("../models/about");

async function renderAbout(req, res) {
  const data = await About.getAbout();

  res.render("admin/about", {
    user: req.user,
    data,
    saved: false,
    error: null
  });
}

async function saveAbout(req, res) {
  try {
    const imagePath = req.file
      ? `/uploads/about/${req.file.filename}`
      : req.body.current_image_path || "";

    await About.updateAbout({
      title: req.body.title,
      description: req.body.description,
      image_path: imagePath
    });

    const data = await About.getAbout();

    res.render("admin/about", {
      user: req.user,
      data,
      saved: true,
      error: null
    });
  } catch (err) {
    console.error(err);
    const data = await About.getAbout();

    res.render("admin/about", {
      user: req.user,
      data,
      saved: false,
      error: "Gagal menyimpan About section"
    });
  }
}

module.exports = {
  renderAbout,
  saveAbout
};
