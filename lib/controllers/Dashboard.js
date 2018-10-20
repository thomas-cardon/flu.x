var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
  if (req.session.authenticated) return res.redirect('/');
  res.render('login', { });
});

router.use(function(req, res, next) {
  if (req.session.authenticated) return next();

  req.session.notify = { status: 401, error: "You're not authorized to see this page. Please connect." };
  res.redirect('/login');
});

router.get('/', function (req, res) {
  res.render('home', { page: 'Flu.x dashboard', description: 'Hello there!' });
});

module.exports = router;
