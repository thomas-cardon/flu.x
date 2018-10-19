const { Report, FeatureEnablerRule } = require('../models');

module.exports = {
  postReport: async (req, h) => {
    await new Report(req.payload).save();
    return { statusCode: 200, message: 'SAVED', success: true };
  },
  getFeatures: function(request, h) {
    return await FeatureEnablerRule.find(q);
  }
}
