const { Alert } = require('../models');
var express = require('express');
var router = express.Router();

router.get('/alerts/v1', async function (req, res, next) {
  let q = {};

  const data = await Alert.findOne().or([{ affectedSummonerIds: { $in: req.query.summoner ? req.query.summoner.split(',') : [] } }, { affectedVersions: req.query.v }, { affectedSummonerIds: null }, { affectedVersions: null }]).lean().exec();
  if (!data) return res.send('');

  res.send(data.message);
  if (data.selfDestruction) data.remove();
});

module.exports = router;
