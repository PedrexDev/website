const express = require("express");
const session = require('express-session');
const path = require("path");
const i18n = require("i18n");
require('dotenv').config();

const contactRoutes = require('./routes/contact');

const app = express();
const port = process.env.PORT || 3000;

i18n.configure({
  locales: ["en", "cs"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  queryParameter: "lang",
  autoReload: true,
  updateFiles: false
});

app.use(i18n.init);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.__ = res.__;
  res.locals.lang = req.getLocale();
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use('/', contactRoutes);

app.get('/', (req, res) => {
  const formSent = req.session.formSent;
  req.session.formSent = false;
  res.render('index', { formSent });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));