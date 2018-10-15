const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SummonerSpellListSchema = new Schema({
	spells: { type: [Number], min: 2, required: true },
	championId: { type: Number, required: true },
	role: { type: String, required: true },
	gameMode: { type: String, required: true },
	gameVersion: { type: String, required: true },
	version: { type: String, required: true }
});

module.exports = mongoose.model('SummonerSpellList', SummonerSpellListSchema);
