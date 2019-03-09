const { ApplicationCrashReport } = require('../models');

const express = require('express');
const router = express.Router();

const multer = require('multer');

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
  res.json({ statusCode: 200, enabled: Settings.features.includes(req.params.feature) || false, success: true });
});

let upload = multer({
  dest: global.appRoot + '/app-crashes'
}).single('upload_file_minidump');

console.dir(global.appRoot + '/app-crashes');

router.post('/api/app-crashes/v1/manaflux', upload, async function (req, res, next) {
  if (req.body._companyName !== 'Ryzzzen/manaflux' || req.body._productName !== 'Manaflux') return;

  await new ApplicationCrashReport({
    summonerId: req.body.summonerId,
    summonerName: req.body.summonerName,
    version: req.body.ver,
    file: global.appRoot + '/app-crashes/' + req.file.filename
  }).save();
});

module.exports = router;
