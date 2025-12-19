"use strict";

const router = require("express").Router();
const { getCMS } = require("../controllers/api");

router.get("/site-content", getCMS);

module.exports = router;
