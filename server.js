'use strict';

const path = require('path');

let s = {};

try {
  s = require('./settings');
}
catch(err) {};

global.Settings = {
  port: process.env.PORT || s.port,
  secret: process.env.secret || s.secret,
  db_url: process.env.db_url || s.db_url,
  env: process.env.PORT ? 'production' : 'development',
  REDIS_HOST: s.REDIS_HOST,
  REDIS_USER: s.REDIS_USER,
  REDIS_PASS: s.REDIS_PASS
};

const { PerkPage, SummonerSpellList, ItemSet, Block, User } = require('./lib/models');
const Login = require('./lib/helpers/Login');

const mongoose = require('mongoose');

const express = require('express'), bodyParser = require('body-parser'), compression = require('compression');

const app = express();

mongoose.connect(Settings.db_url, { useNewUrlParser: true });
app.locals.moment = require('moment');

app.use(compression());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', express.static('static/public'));

app.use('/data', require('./lib/controllers/Package'));
app.use('/', require('./lib/controllers/Misc'));
app.use('/', require('./lib/controllers/Dashboard'));

app.use(function(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
});

app.set('views','./lib/views');
app.set('view engine', 'pug');

app.listen(Settings.port, function () {
  console.log(`Flu.x running on port ${Settings.port}`);
});
