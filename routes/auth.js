"use strict";

const router = require("express").Router();
const { renderLogin, postLogin, logout, requireAuthJWT } = require("../controllers/auth");

// login page + submit
router.get("/login", renderLogin);
router.post("/login", postLogin);

// logout
router.post("/logout", logout);

module.exports = router;
