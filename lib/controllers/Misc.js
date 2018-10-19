const { Report, FeatureEnablerRule } = require('../models');

module.exports = {
  postReport: async (req, h) => {
    await new Report(req.payload).save();
    return { statusCode: 200, message: 'SAVED', success: true };
  },
  getFeatures: async (req, h, q = {}) => {
    if (req.query.v) q.affectedVersions = req.query.v;
    if (req.query.summoner) q.affectedSummoners = { $in: req.query.summoner.split(',') };

    return await FeatureEnablerRule.find(q);
  }
}
