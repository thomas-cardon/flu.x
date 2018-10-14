const { PerkPage, SummonerSpellList, ItemSet, Block } = require('../models');

module.exports = {
  find: async function(q) {
    const data = {}, roles = await PerkPage.find().distinct('role');

    for (let role of roles) {
      data[role] = {
        perks: await PerkPage.find({ ...q, role }).select('-_v -_id').lean(),
        itemsets: await ItemSet.find({ ...q, role }).select('-_v -_id').lean(),
        summonerspells: (await SummonerSpellList.find({ ...q, role }).select('-_v -_id').lean()).map(x => x.spells),
      };
    }

    return { roles: data, ...q, championId: parseInt(q.championId), fromFlux: true };
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
