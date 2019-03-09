const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationCrashReportSchema = new Schema({
  summonerId: { type: Number, default: 0 },
  summonerName: { type: String, default: 'This was recorded before a summoner was logged in.' },
  version: { type: String, required: true },
  _created: { type: Date, default: Date.now },
  file: String
});

module.exports = mongoose.model('ApplicationCrash', ApplicationCrashReportSchema);
