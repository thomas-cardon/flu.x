const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProviderDataSchema = new Schema({
  perks: [require('./PerkPage').schema],
  itemsets: [require('./ItemSet').schema],
  summonerspells: { type: [Number], required: true },
  statistics: {}
});

module.exports = mongoose.model('ProviderData', ProviderDataSchema);
