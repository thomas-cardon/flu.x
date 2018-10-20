const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  validate: async data => {
    const user = await User.findOne({ email: data.email });
    if (!user) return { isValid: false };

    if (!user.password) {
      user.password = await bcrypt.hash(data.password, 10);
      await user.save();
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    return isValid ? { isValid, id: user._id, name: user.name, email: user.email, rank: user.rank, avatar: user.avatar, github: user.github } : { isValid };
  },
  hash: async password => {
    return await bcrypt.hash(password, 10);
  }
};
