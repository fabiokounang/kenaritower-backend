"use strict";

const Services = require("../models/services");

async function renderServices(req, res) {
  const items = await Services.listServices();

  res.render("admin/services", {
    user: req.user,
    items,
    saved: false,
    error: null
  });
}

async function addService(req, res) {
  await Services.insertService({
    title: req.body.title,
    description: req.body.description
  });

  res.redirect("/admin/services");
}

async function saveServices(req, res) {
  const items = req.body.items || [];

  for (const it of items) {
    await Services.updateService(it.id, {
      title: it.title,
      description: it.description,
      sort_order: it.sort_order,
      is_active: it.is_active
    });
  }

  const updated = await Services.listServices();

  res.render("admin/services", {
    user: req.user,
    items: updated,
    saved: true,
    error: null
  });
}

async function deleteService(req, res) {
  await Services.deleteService(req.params.id);
  res.redirect("/admin/services");
}

async function apiServices(req, res) {
  const rows = await Services.listServices();
  res.json(rows.filter(r => r.is_active));
}

module.exports = {
  renderServices,
  addService,
  saveServices,
  deleteService,
  apiServices
};
