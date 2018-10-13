const { PerkPage, SummonerSpellList, ItemSet, Block } = require('../models');

module.exports = {
  find: async function(q) {
    const roles = await PerkPage.find().distinct('role');
    const data = [
      await Promise.all(roles.map(role => PerkPage.find({ ...q, role }).select('-_v -_id').lean())),
      await Promise.all(roles.map(role => ItemSet.find({ ...q, role }).select('-_v -_id').lean())),
      await Promise.all(roles.map(role => SummonerSpellList.find({ ...q, role }).select('-_v -_id').lean())),
    ];

    return data.some(x => x.length === 0) ? null : { perks: data[0], summonerspells: data[1], itemsets: data[2], ...q };
  },
  post: async function(payload) {
    for (const [roleName, role] of Object.entries(payload.roles)) {
      await new SummonerSpellList({ championId: payload.championId, gameMode: payload.gameMode, version: payload.version, gameVersion: payload.gameVersion, role: roleName, spells: role.summonerspells }).save();

      role.perks.forEach(x => new PerkPage({ championId: payload.championId, gameMode: payload.gameMode, version: payload.version, gameVersion: payload.gameVersion, role: roleName, ...x }).save());
      role.itemsets.forEach(x => new ItemSet({ championId: payload.championId, gameMode: payload.gameMode, version: payload.version, gameVersion: payload.gameVersion, role: roleName, ...x }).save());
    }

    return true;
  }
}
