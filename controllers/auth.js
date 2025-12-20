"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByEmail } = require("../models/user");

function renderLogin(req, res) {
  return res.render("login", { error: null, email: "" });
}

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  });
}

function setJwtCookie(res, token) {
  const cookieName = process.env.JWT_COOKIE_NAME;
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 8 // 8 hours (sync sama expiresIn kalau mau)
  });
}

function clearJwtCookie(res) {
  const cookieName = process.env.JWT_COOKIE_NAME;
  res.clearCookie(cookieName);
}

async function postLogin(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) return res.status(400).render("login", { error: "Email & password wajib diisi.", email });

  const user = await findByEmail(email);
  if (!user || user.is_active !== 1) return res.status(401).render("login", { error: "Login gagal.", email });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).render("login", { error: "Login gagal.", email });

  const token = signToken({
    sub: String(user.id),
    email: user.email,
    role: user.role
  });

  setJwtCookie(res, token);
  return res.redirect("/admin");
}

function logout(req, res) {
  clearJwtCookie(res);
  return res.redirect("/auth/login");
}

/** Middleware protect */
function requireAuthJWT(req, res, next) {
  try {
    const cookieName = process.env.JWT_COOKIE_NAME;
    const token = req.cookies?.[cookieName];

    if (!token) return res.redirect("/login");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, email, role, iat, exp }
    return next();
  } catch (e) {
    return res.redirect("/login");
  }
}

module.exports = { renderLogin, postLogin, logout, requireAuthJWT };
