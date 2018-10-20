var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
  if (req.session && req.session.authenticated) return res.redirect('/');
  res.render('login', { });
});

router.use(function(req, res, next) {
  if (req.session && req.session.authenticated) next();
  else return res.redirect(403, '/login');
});

router.get('/', function (req, res) {
  res.render('home', { page: 'Flu.x dashboard', description: 'Hello there!' });
});

module.exports = router;
