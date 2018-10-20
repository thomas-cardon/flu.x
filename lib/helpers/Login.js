const { User } = require('../models');
const Bcrypt = require('bcrypt');

module.exports = {
  validate: async data => {
    const user = await User.findOne({ email: data.email });
    if (!user) return { isValid: false };

    const isValid = await Bcrypt.compare(data.password, user.password);
    return isValid ? { isValid, id: user._id, name: user.name, email: user.email, rank: user.rank, avatar: user.avatar, github: user.github } : { isValid };
  }
};
