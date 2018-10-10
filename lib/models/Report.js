const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  text: { type: String, required: true },
  type: { type: String, required: true },
  contact: { type: String, required: true },
  summonerId: { type: Number, required: true },
  summonerName: { type: String, required: true }
});

module.exports = mongoose.model('Reports', ReportSchema);
