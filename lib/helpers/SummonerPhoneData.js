const { SummonerPhoneData } = require('../models');
const bcrypt = require('bcrypt');

module.exports = {
  validate: async data => {
    const summoner = await SummonerPhoneData.findOne({ summonerId: data.summonerId });
    if (!summoner) return false;
    if (!summoner.password) return null;

    return await bcrypt.compare(data.password, summoner.password);
  },
  hash: async password => {
    return await bcrypt.hash(password, 10);
  }
};
