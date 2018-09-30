'use strict';

const path = require('path');
const Hapi = require('hapi'), Hoek = require('hoek');

const Settings = require('./settings');
const Routes = require('./lib/routes');
const { ItemSet, PerkPage, ProviderData } = require('./lib/models');

const mongoose = require('mongoose');

const server = Hapi.server({
    port: Settings.port,
    host: Settings.host,
    debug: Settings.env === 'development' ? { request: ['error'] } : {}
});

const init = async () => {
  mongoose.connect(Settings.db_url, { useNewUrlParser: true });
  await server.register([ require('vision'), require('inert') ]);

  // View settings
  server.views({
    engines: { pug: require('pug') },
    path: path.join(__dirname, 'lib/views'),
    helpersPath: path.join(__dirname, 'lib/helpers'),
    compileOptions: {
      pretty: false
    },
    isCached: Settings.env === 'production'
  });

  // Add routes
  server.route(Routes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
