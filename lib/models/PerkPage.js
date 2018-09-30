const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PerkPageSchema = new Schema({
	name: { type: Number, required: true },
	primaryStyleId: { type: Number, required: true },
	selectedPerkIds: { type: [Number], required: true },
	subStyleId: { type: Number, required: true }
});

module.exports = mongoose.model('PerkPages', PerkPageSchema);
