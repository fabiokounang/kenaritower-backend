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

const ALLOWED_ORIGINS = new Set([
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://kenaritower.com",
  "https://www.kenaritower.com",
  // kalau kamu kadang akses FE lewat netlify subdomain:
  // "https://kenaritower.netlify.app",
]);

const corsOptions = {
  origin: (origin, cb) => {
    // allow server-to-server, curl, same-origin
    if (!origin) return cb(null, true);

    // normalize (hapus trailing slash kalau ada)
    const normalized = origin.replace(/\/$/, "");

    if (ALLOWED_ORIGINS.has(normalized)) return cb(null, true);

    // jangan throw error biar nggak spam log & nggak bikin 500
    console.log("[CORS BLOCKED]", { origin, normalized });
    return cb(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.set("trust proxy", 1);
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
  console.log(`✅ CMS running on port ${PORT}`);
});
