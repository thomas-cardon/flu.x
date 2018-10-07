const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageSchema = new Schema({
  roles: new Schema({
    TOP: require('./ProviderData').schema,
    MIDDLE: require('./ProviderData').schema,
    JUNGLE: require('./ProviderData').schema,
    ADC: require('./ProviderData').schema,
    SUPPORT: require('./ProviderData').schema,
  }),
  providerId: { type: String, required: true },
	championId: { type: Number, required: true },
	gameMode: { type: String, required: true },
});

module.exports = mongoose.model('Package', PackageSchema);
