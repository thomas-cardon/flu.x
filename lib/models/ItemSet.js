const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSetSchema = new Schema({
	title: { type: String, default: 'Unnamed Manaflux set' },
	blocks: [{ items: { type: Object, required: true }, recMath: { type: Boolean, default: false }, type: { type: String, default: 'Unnamed Manaflux block' } }],
	map: { type: String, default: 'any' },
	mode: { type: String, default: 'any' },
	type: { type: String, default: 'custom' },
	priority: { type: Boolean, default: true }
});

module.exports = mongoose.model('ItemSets', ItemSetSchema);
