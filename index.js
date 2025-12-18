require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require("cookie-parser");

const path = require('path');

const app = express();

const api = require("./routes/api");
const auth = require("./routes/auth");
const admin = require("./routes/admin");


// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
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
