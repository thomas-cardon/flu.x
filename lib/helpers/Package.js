const { PerkPage, SummonerSpellList, ItemSet, Block } = require('../models');

module.exports = {
  find: async function(q) {
    const data = {}, roles = await PerkPage.find().distinct('role');

    for (let role of roles) {
      const spells = await SummonerSpellList.findOne({ ...q, role }).select('spells').lean();
      data[role] = {
        perks: await PerkPage.find({ ...q, role }).limit(5).select('-_v -_id').lean(),
        itemsets: await ItemSet.find({ ...q, role }).limit(5).select('-_v -_id').lean(),
        summonerspells: spells ? spells.spells : []
      };

      if (data[role].perks.length === 0) delete data[role];
    }

    if (Object.keys(data).length === 0 && data.constructor === Object) return { statusCode: 404, error: 'DATA_NOT_FOUND', message: 'There\'s no data available for this champion.' };

    return { roles: data, ...q, championId: parseInt(q.championId) };
  },
  post: async function(payload) {
    console.log(`Upload for champion ${payload.championId}, roles: ${Object.keys(payload.roles).join(', ')}`);

    for (const [roleName, role] of Object.entries(payload.roles)) {
      q = { championId: payload.championId, gameMode: payload.gameMode, version: payload.version, gameVersion: payload.gameVersion, role: roleName };

      await SummonerSpellList.updateOne({ ...q, spells: role.summonerspells }, { ...q, spells: role.summonerspells }, {upsert: true});

      for (const perk of role.perks)
        await PerkPage.updateOne({ ...q, ...perk }, { ...q, ...perk }, {upsert: true}).exec();

      for (const itemset of role.itemsets)
        await ItemSet.updateOne({ ...q, ...itemset }, { ...q, ...itemset }, {upsert: true}).exec();
    }

    return true;
  }
}
