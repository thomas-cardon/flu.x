const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeatureEnablerRuleSchema = new Schema({
  affectedSummoners: { type: [String], default: [] },
  affectedVersions: { type: [String], default: [] },
  featuresEnabled: { type: [String], default: [] },
  featuresDisabled: { type: [String], default: [] },
  comment: { type: String, required: true }
});

module.exports = mongoose.model('FeatureEnablerRule', FeatureEnablerRuleSchema);
