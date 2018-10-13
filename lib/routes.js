'use strict';

const Home = require('./controllers/Home');
const Perks = require('./controllers/Perks');
const Package = require('./controllers/Package');

const Misc = require('./controllers/Misc');

module.exports = [
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: require('path').join(__dirname, '../static/public')
      }
    },
    config: {
      description: 'Provides static resources'
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: Home,
    config: {
      description: 'Shows the dashboard'
    }
  },
  {
    method: 'GET',
    path: '/v1/perks/{championId}',
    handler: Perks.get,
    config: {
      description: 'Gets the perks for a champion by its id'
    }
  },
  {
    method: 'GET',
    path: '/v1/data/{championId}',
    handler: Package.get,
    config: {
      description: 'Gets the data for a champion by its id'
    }
  },
  {
    method: 'GET',
    path: '/v1/data/{championId}/{role}',
    handler: Package.getByRole,
    config: {
      description: 'Gets the data for a champion by its id and its role'
    }
  },
  {
    method: 'POST',
    path: '/v1/data',
    handler: Package.post,
    config: {
      description: 'Posts data for a champion'
    }
  },
  {
    method: 'POST',
    path: '/v1/bugreports',
    handler: Misc.postReport,
    config: {
      description: 'Saves bugreports in the database'
    }
  }
];
