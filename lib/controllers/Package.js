var express = require('express');
var router = express.Router();

const Package = require('../helpers/Package');

router.get('/v1/:championId', async function(req, res, next) {
  let q = { championId: req.params.championId };

  try {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) throw Error('ChampionId must be a non-zero number');
    const data = await Package.find(q, req.query.itemsets === 'true', req.query.summonerspells === 'true') || { statusCode: 404, error: 'DATA_MISSING', message: 'Missing data' };

    res.json(data);
  }
  catch(err) {
    next(err);
  }
});

router.get('/v1/:championId/:role', async function(req, res, next) {
  let q = { championId: req.params.championId, role: req.params.role };

  try {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) throw Error('ChampionId must be a non-zero number');
    const data = await Package.find(q, req.query.itemsets === 'true', req.query.summonerspells === 'true') || { statusCode: 404, error: 'DATA_MISSING', message: 'Missing data' };

    res.json(data);
  }
  catch(err) {
    next(err);
  }
});

router.post('/v1/upload', async function(req, res, next) {
  if (!req.payload.roles) return { statusCode: 404, error: 'ROLES_NOT_FOUND', message: 'Data is incomplete' }
  return Package.post(req.payload) ? { statusCode: 200, message: 'SAVED', success: true } : { statusCode: 500, message: 'NOT_SAVED' };
});

module.exports = router;
