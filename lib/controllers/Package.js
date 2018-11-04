var express = require('express');
var router = express.Router();

const cache = require('express-redis-cache')({
  host: Settings.REDIS_HOST, port: 9069, auth_pass: Settings.REDIS_PASS
});

const Package = require('../helpers/Package');

router.post('/:version/upload', async function(req, res, next) {
  if (!Package['post' + req.params.version]) return res.json({ statusCode: 500, error: 'VERSION_ERROR', message: 'Update your client!' });
  if (!req.body.roles) return res.json({ statusCode: 404, error: 'ROLES_NOT_FOUND', message: 'Data is incomplete' });

  if (await Package['post' + req.params.version](req.body)) res.json({ statusCode: 200, message: 'SAVED', success: true });
  else res.json({ statusCode: 500, message: 'NOT_SAVED' });
});

router.get('/:version/bulkdownload', cache.route({ expire: 3600 }), function(req, res, next) {
  if (!Package['bulkDownload' + req.params.version]) return res.json({ statusCode: 500, error: 'VERSION_ERROR', message: 'Update your client!' });

  cache.get('bulk', async (err, data) => {
    console.log(`Accessing cache (${data.length > 0 ? 'available' : 'no data!'})`)
    if(!err && data.length > 0) return res.json(JSON.parse(data[0]));
    else {
      if (err) console.error(err);

      const data = await Package['bulkDownload' + req.params.version]();
      res.json(data);

      cache.add('bulk', JSON.stringify(data), function(err, entry) {
        if (err) console.error(err);
        else console.log('Saved to cache!');
      });
    }
  });
});

router.get('/:version/:championId', async function(req, res, next) {
  if (!Package['find' + req.params.version]) return res.json({ statusCode: 500, error: 'VERSION_ERROR', message: 'Update your client!' });

  let q = { championId: req.params.championId };

  try {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) throw Error('ChampionId must be a non-zero number');
    const data = await Package['find' + req.params.version](q, req.query.itemsets === 'true', req.query.summonerspells === 'true') || { statusCode: 404, error: 'DATA_MISSING', message: 'Missing data' };

    res.json(data);
  }
  catch(err) {
    next(err);
  }
});

router.get('/:version/:championId/:role', async function(req, res, next) {
  if (!Package['find' + req.params.version]) return res.json({ statusCode: 500, error: 'VERSION_ERROR', message: 'Update your client!' });

  let q = { championId: req.params.championId, role: req.params.role };

  try {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) throw Error('ChampionId must be a non-zero number');
    const data = await Package['find' + req.params.version](q, req.query.itemsets === 'true', req.query.summonerspells === 'true', isNaN(req.query.maxperkpages) ? 2 : parseInt(req.query.maxperkpages)) || { statusCode: 404, error: 'DATA_MISSING', message: 'Missing data' };

    res.json(data);
  }
  catch(err) {
    next(err);
  }
});

module.exports = router;
