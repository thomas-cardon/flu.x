const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  validate: async data => {
    const user = await User.findOne({ email: data.email });
    if (!user) return { isValid: false };

    const isValid = await bcrypt.compare(data.password, user.password);
    console.dir(isValid);

    return isValid ? { isValid, id: user._id, name: user.name, email: user.email, rank: user.rank, avatar: user.avatar, github: user.github } : { isValid };
  },
  hash: async password => {
    return await bcrypt.hash(password, 10);
  }
};
