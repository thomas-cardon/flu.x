'use strict';

const Home = require('./controllers/Home');
const Perks = require('./controllers/Perks');

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
    path: '/perks/{championId}',
    handler: Perks.get,
    config: {
      description: 'Gets the perks for a champion by its id'
    }
  },
  {
    method: 'POST',
    path: '/perks/{championId}',
    handler: Perks.post,
    config: {
      description: 'Adds the perks for a champion by its id'
    }
  }
];
