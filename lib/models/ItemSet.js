const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlockSchema = new Schema({
	items: [{
		id: { type: String, required: true },
		count: { type: Number, default: 1 }
	}],
	_type: {
		i18n: { type: String, required: true },
		arguments: { type: Array, default: Array },
	},
	recMath: { type: Boolean, default: false }
}, { _id : false }), Block = mongoose.model('Block', BlockSchema);

const ItemSetSchema = new Schema({
	title: { type: String, default: 'Unnamed Manaflux set' },
	blocks: [BlockSchema],
	map: { type: String, default: 'any' },
	mode: { type: String, default: 'any' },
	type: { type: String, default: 'custom' },
	priority: { type: Boolean, default: true },
	championId: { type: Number, required: true },
	role: { type: String, required: true },
	gameMode: { type: String, required: true },
	gameVersion: { type: String, required: true },
	version: { type: String, required: true },
	provider: { type: String, default: 'flux' }
}, { strict: false });

module.exports = { ItemSet: mongoose.model('ItemSet', ItemSetSchema), Block };
