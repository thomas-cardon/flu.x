const router = require('express').Router(), bodyParser = require('body-parser');
const Login = require('../helpers/Login');

router.get('/login', function(req, res) {
  if (req.session.authenticated) return res.redirect('/');
  let data = {};

  if (req.session.notify) data.notify = req.session.notify;

  res.render('login', data);
  req.session.notify = null;
});

router.use(bodyParser.json());
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

router.get('/', function (req, res) {
  res.render('home', { page: 'Flu.x dashboard', description: 'Hello there!' });
});

module.exports = router;
