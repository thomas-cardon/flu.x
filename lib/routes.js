'use strict';

const Home = require('./controllers/Home');
const Perks = require('./controllers/Perks');
const ProviderData = require('./controllers/ProviderData');

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
    handler: ProviderData.get,
    config: {
      description: 'Gets the perks for a champion by its id'
    }
  },
  {
    method: 'GET',
    path: '/v1/data/{championId}/{role}',
    handler: ProviderData.getByRole,
    config: {
      description: 'Gets the perks for a champion by its id and its role'
    }
  },
  {
    method: 'POST',
    path: '/v1/data',
    handler: ProviderData.post,
    config: {
      description: 'Adds the perks for a champion by its id'
    }
  }
];
