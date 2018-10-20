'use strict';

const path = require('path');

const Settings = require('./settings');

const { PerkPage, SummonerSpellList, ItemSet, Block, User } = require('./lib/models');
const Login = require('./lib/helpers/Login');

const mongoose = require('mongoose');

const express = require('express'), compression = require('compression');

const app = express();

mongoose.connect(Settings.db_url, { useNewUrlParser: true });

app.use(session({
  secret: Settings.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: Settings.env === 'production' }
}));

app.use(compression());
app.use('/', express.static('static/public'));

app.use('/data', require('./lib/controllers/Package'));
app.use('/', require('./lib/controllers/Misc'));
app.use('/', require('./lib/controllers/Dashboard'));

app.set('views','./lib/views');
app.set('view engine', 'pug');

app.listen(Settings.port, function () {
  console.log(`Flu.x running on port ${Settings.port}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
