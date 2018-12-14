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
  coinhive_secret: process.env.COINHIVE_SECRET || s.coinhive_secret,
  firebase_projectId: process.env.FIREBASE_PROJECTID || s.firebase_projectId,
  firebase_privateKey: process.env.FIREBASE_PRIVATEKEY || s.firebase_privateKey,
  firebase_clientEmail: process.env.FIREBASE_CLIENTEMAIL || s.firebase_clientEmail,
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


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', express.static('static/public'));

app.use('/data', require('./lib/controllers/Package'));
app.use('/api', require('./lib/controllers/Alert'));
app.use('/', require('./lib/controllers/Misc'));
app.use('/', require('./lib/controllers/SummonerPhoneData'));
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
