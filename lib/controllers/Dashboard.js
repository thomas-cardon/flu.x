const { Report } = require('../models');

const router = require('express').Router();
const Login = require('../helpers/Login');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

router.use(session({
  secret: Settings.secret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { secure: false }
}));


router.get('/login', function(req, res) {
  if (req.session.authenticated) return res.redirect('/');
  let data = {};

  if (req.session.notify) data.notify = req.session.notify;

  res.render('login', data);
  req.session.notify = null;
});

router.get('/logout', function(req, res) {
  if (req.session.authenticated) {
    req.session.authenticated = false;
    req.session.user = null;

    req.session.notify = { statusCode: 200, error: 'SIGNED_OUT', message: "You've been successfully signed out." };
    return res.redirect('/login');
  }
  else {
    req.session.notify = { statusCode: 401, error: 'MISSING_CREDENTIALS', message: "You can't sign out if you're not connected." };
    return res.redirect('/login');
  }
});

router.post('/auth', async function(req, res, next) {
  if (req.session.authenticated) return res.redirect('/');
  if (!req.body) {
    req.session.notify = { statusCode: 401, error: 'MISSING_CREDENTIALS', message: "No data has been passed." };
    res.redirect('/login');
  }
  else {
    try {
      req.session.user = await Login.validate(req.body);
      req.session.authenticated = req.session.user.isValid;

      if (!req.session.authenticated) {
        req.session.notify = { statusCode: 401, error: 'WRONG_USERNAME_OR_PASSWORD', message: "You've typed the wrong username or password. Try again." };
        res.redirect('/login');
      }
      else res.redirect('/');
    }
    catch(err) {
      next(err);
    }
  }
});

router.use(function(req, res, next) {
  if (req.session.authenticated) return next();

  req.session.notify = { statusCode: 401, error: 'NOT_AUTHORIZED', message: "You're not authorized to see this page. Please connect." };
  res.redirect('/login');
});

router.get('/', async function (req, res) {
  res.render('home', {
    page: 'Flu.x dashboard',
    description: 'Allows control over Manaflux clients',
    user: req.session.user,
    lastReports: await Report.find({}).sort({ _id: 1 }).limit(5)
  });
});

module.exports = router;
