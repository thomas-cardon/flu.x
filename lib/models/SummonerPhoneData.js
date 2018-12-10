const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SummonerPhoneDataSchema = new Schema({
  summonerId: { type: Number, required: true },
  password: { type: String, required: true },
  registrationToken: { type: String, required: true },
  settings: {}
});

module.exports = mongoose.model('SummonerPhoneData', SummonerPhoneDataSchema);
