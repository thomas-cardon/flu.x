const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PerkPageSchema = new Schema({
	name: { type: String, required: true },
	primaryStyleId: { type: Number, required: true },
	subStyleId: { type: Number, required: true },
	selectedPerkIds: { type: [Number], required: true, min: 6 },
	championId: { type: Number, required: true },
	role: { type: String, required: true },
	gameMode: { type: String, required: true },
	gameVersion: { type: String, required: true },
	version: { type: String, required: true }
});

module.exports = mongoose.model('PerkPage', PerkPageSchema);
