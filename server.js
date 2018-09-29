'use strict';

const path = require('path');
const Hapi = require('hapi'), Hoek = require('hoek');

const Settings = require('./settings');
const Routes = require('./lib/routes');

const server = Hapi.server({
    port: Settings.port,
    host: 'localhost'
});

const init = async () => {
  await server.register([ require('vision'), require('inert') ]);
  
  // View settings
  server.views({
    engines: { pug: require('pug') },
    path: path.join(__dirname, 'lib/views'),
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
