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

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // curl, server-to-server

  // allow kenaritower.com + subdomain apapun
  if (/^https:\/\/([a-z0-9-]+\.)*kenaritower\.com$/i.test(origin)) {
    return true;
  }

  // allow netlify domains (production + preview)
  if (/^https:\/\/([a-z0-9-]+--)?kenaritower\.netlify\.app$/i.test(origin)) {
    return true;
  }

  // local dev
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return true;
  }

  return false;
};

app.use(cors({
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) return cb(null, true);

    console.error("❌ CORS BLOCKED:", origin);
    return cb(null, false); // JANGAN throw error
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.options("*", cors(corsOptions));
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


// session
app.use(session({
  secret: process.env.SESSION_SECRET || "kenari-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true di https
    sameSite: "lax", // untuk admin di cms.kenaritower.com
  }
}));

// routes
app.use("/api", api);
app.use("/auth", auth);
app.use("/admin", admin);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ CMS running on port ${PORT}`);
});
