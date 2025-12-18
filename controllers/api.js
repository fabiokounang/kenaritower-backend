"use strict";

const { getPublicCMS } = require("../models/cms");

async function getCMS(req, res) {
  const data = await getPublicCMS();
  return res.json({ ok: true, data });
}

async function getCMS(req, res) {
  const data = await getPublicCMS();
  return res.json({ ok: true, data });
}

module.exports = { getCMS };
