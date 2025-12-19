require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

const app = express();

const api = require("./routes/api");
const auth = require("./routes/auth");
const admin = require("./routes/admin");


// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
const ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:3000",
  'https://kenaritower.com',
  'https://www.kenaritower.com'
];

app.use(cors({
  origin: function (origin, cb) {
    // allow tools / server-to-server / same-origin (origin undefined)
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // aman kalau nanti pakai cookie/session
}));

// ✅ Preflight
app.options("*", cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


// session
app.use(session({
  secret: process.env.SESSION_SECRET || 'kenari-secret',
  resave: false,
  saveUninitialized: false
}));

// routes
app.use("/api", api);
app.use("/auth", auth);
app.use("/admin", admin);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ CMS running on http://localhost:${PORT}`);
});
