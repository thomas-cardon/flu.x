const { User } = require('../models');
const Bcrypt = require('bcrypt');

module.exports = {
  validate: async (decoded, request) => {
    const user = await User.findOne({ $or:[{ name: decoded.username }, { email: decoded.username }] });
    if (!user) return { credentials: null, isValid: false };

    const isValid = await Bcrypt.compare(decoded.password, user.password);
    const credentials = { id: user._id, name: user.name };

    return { isValid, credentials };
  }
};
