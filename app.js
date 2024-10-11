const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const path = require('path');
const Router = require('./routes/routes');
const session = require('cookie-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./Models/userModel');
const bodyPraser = require('body-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
app.use(express.json());
dotEnv.config({ path: './config.env' });
app.use(
  session({
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: false,
  })
);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new localStrategy({ usernameField: 'email' }, User.authenticate())
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyPraser.urlencoded({ extended: true }));
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;

  next();
});
app.use(methodOverride('_method'));
app.use('/', Router);

module.exports = app;
