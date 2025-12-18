"use strict";

const router = require("express").Router();
const { getCMS } = require("../controllers/api");

router.get("/hotel_profile", getCMS);

module.exports = router;
