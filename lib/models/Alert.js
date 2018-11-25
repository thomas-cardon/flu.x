const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlertSchema = new Schema({
  affectedSummonerIds: [String],
  affectedVersions: [String],
  selfDestruction: { type: Boolean, default: false },
  message: String
});

module.exports = mongoose.model('Alert', AlertSchema);
