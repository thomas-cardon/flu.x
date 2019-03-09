const { Report } = require('../models');
var express = require('express');
var router = express.Router();

router.post('/reports/v1', async function (req, res, next) {
  try {
    await new Report(req.body).save();
    res.json({ statusCode: 200, message: 'SAVED', success: true });
  }
  catch(err) {
    next(err);
  }
});

router.get('/api/features/v1/:feature', async function (req, res, next) {
  res.json({ statusCode: 200, enabled: process.env.features.includes(req.params.feature) || false, success: true });
});

router.get('/api/app-crashes/manaflux', async function (req, res, next) {
  console.log('Filename', req.body.filename = req.file.filename);
  console.dir(req.body);

  await new Report({
    text: ``,
    type: 'CRASH_REPORT',
    contact: null,
    summonerId: null,
    summonerName: null,
    version: req.body._version,
    _created: { type: Date, default: Date.now },
    logs: 'Not available.'
  }).save();
});

module.exports = router;
