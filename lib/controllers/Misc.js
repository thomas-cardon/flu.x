var express = require('express');
var router = express.Router();

const { Report, FeatureEnablerRule } = require('../models');

router.post('/reports/v1', async function (req, res, next) {
  try {
    await new Report(req.payload).save();
    res.json({ statusCode: 200, message: 'SAVED', success: true });
  }
  catch(err) {
    next(err);
  }
});

router.get('/features/v1', async function (req, res, next) {
  if (req.query.v) q.affectedVersions = req.query.v;
  if (req.query.summoner) q.affectedSummoners = { $in: req.query.summoner.split(',') };

  const data = await FeatureEnablerRule.find(q);
  res.json({ enabled: [].concat(...data.map(x => x.featuresEnabled)), disabled: [].concat(...data.map(x => x.featuresDisabled)) });
});

module.exports = router;
