const { PerkPage, SummonerSpellList, ItemSet, Block } = require('../models');

module.exports = {
  find: async function(q, itemsets, summonerspells) {
    const data = {}, roles = await PerkPage.find().distinct('role');

    for (let role of roles) {
      const spellsData = await SummonerSpellList.findOne({ ...q, role }).select('spells').lean();
      data[role] = {
        perks: await PerkPage.find({ ...q, role, selectedPerkIds: { $exists: true, $not: { $size: 0 }  } }).limit(5).select('-__v -_id -championId -gameMode -role -version -gameVersion').lean(),
        itemsets: !itemsets ? [] : await ItemSet.find({ ...q, role }).limit(5).select('-__v -_id -championId -gameMode -role -version -gameVersion').lean(),
        summonerspells: summonerspells && spellsData ? spellsData.spells : []
      };

      if (data[role].perks.length === 0 || (itemsets && data[role].itemsets.length === 0) || (summonerspells && data[role].summonerspells.length === 0)) delete data[role];
    }

    if (Object.keys(data).length === 0 && data.constructor === Object) return { statusCode: 404, error: 'DATA_NOT_FOUND', message: 'There\'s no data available for this champion.' };

    return { roles: data, ...q, championId: parseInt(q.championId) };
  },
  post: async function(payload) {
    console.log(`Upload for champion ${payload.championId}, roles: ${Object.keys(payload.roles).join(', ')}`);

    for (const [roleName, role] of Object.entries(payload.roles)) {
      q = { championId: payload.championId, gameMode: payload.gameMode, gameVersion: payload.gameVersion, role: roleName };

      await SummonerSpellList.updateOne({ ...q, spells: role.summonerspells }, { ...q, spells: role.summonerspells }, {upsert: true});

      for (const perk of role.perks)
        await PerkPage.updateOne({ ...q, ...perk }, { ...q, ...perk }, {upsert: true}).exec();

      for (const itemset of role.itemsets)
        await ItemSet.updateOne({ ...q, ...itemset }, { ...q, ...itemset }, {upsert: true}).exec();
    }

    return true;
  }
}
