const { SummonerPhoneData } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  validate: async data => {
    const d = await SummonerPhoneData.findOne({ summonerId: data.summonerId });
    if (!d) return { isValid: false };
    if (!d.password) return { isValid: null };

    return { data: d, isValid: await bcrypt.compare(data.password, d.password) }
  },
  hash: async password => {
    return await bcrypt.hash(password, 10);
  }
};
