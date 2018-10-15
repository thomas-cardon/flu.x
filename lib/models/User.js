const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String },
	github: { type: String, required: true },
	rank: { type: Number, default: 0 },
	avatar: { type: String, default: '/assets/default-avatar.png' }
})

module.exports = mongoose.model('User', UserSchema);
