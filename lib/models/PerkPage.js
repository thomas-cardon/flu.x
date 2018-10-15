const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PerkPageSchema = new Schema({
	name: { type: String, required: true },
	primaryStyleId: { type: Number, required: true },
	subStyleId: { type: Number, required: true },
	selectedPerkIds: { type: [Number], min: 6, required: true },
	championId: { type: Number, required: true },
	role: { type: String, required: true },
	gameMode: { type: String, required: true },
	gameVersion: { type: String, required: true },
	version: { type: String, required: true }
});

module.exports = mongoose.model('PerkPage', PerkPageSchema);
