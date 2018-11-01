const { PerkPage, SummonerSpellList, ItemSet, Block } = require('../models');

module.exports = {
  findv1: async function(q, itemsets, summonerspells, maxPerkPages = 2) {
    const data = {}, roles = await PerkPage.find().distinct('role');

    for (let role of roles) {
      const spellsData = await SummonerSpellList.findOne({ ...q, role }).select('spells').lean();

      data[role] = {
        perks: await PerkPage.find({ championId: q.championId, role, selectedPerkIds: { $exists: true, $not: { $size: 0 }  } }).limit(maxPerkPages).select('-__v -_id -championId -gameMode -role -version -gameVersion').lean(),
        itemsets: !itemsets ? [] : await ItemSet.find({ ...q, role }).limit(5).select('-__v -_id -championId -gameMode -role -version -gameVersion').lean(),
        summonerspells: summonerspells && spellsData ? spellsData.spells : []
      };

      if (data[role].perks.length === 0 || (itemsets && data[role].itemsets.length === 0) || (summonerspells && data[role].summonerspells.length === 0)) delete data[role];
    }

    if (Object.keys(data).length === 0 && data.constructor === Object) return { statusCode: 404, error: 'DATA_NOT_FOUND', message: 'There\'s no data available for this champion.' };

    return { roles: data, ...q, championId: parseInt(q.championId) };
  },
  postv1: async function(payload) {
    console.log(`Upload for champion ${payload.championId}, roles: ${Object.keys(payload.roles).join(', ')}`);

    for (const [roleName, role] of Object.entries(payload.roles)) {
      q = { championId: payload.championId, gameMode: payload.gameMode, gameVersion: payload.gameVersion, role: roleName };

      if (role.summonerspells.length >= 2) await SummonerSpellList.updateOne({ championId: payload.championId, role: roleName, gameMode: payload.gameMode, spells: role.summonerspells }, { ...q, spells: role.summonerspells }, { upsert: true });

      for (const perk of role.perks)
        if (perk.selectedPerkIds.length >= 6) await PerkPage.updateOne({ championId: payload.championId, role: roleName, gameMode: payload.gameMode, selectedPerkIds: perk.selectedPerkIds }, { ...q, ...perk }, { upsert: true }).exec();
        else console.log("A perk page hasn't been uploaded because of missing perks");

      for (const itemset of role.itemsets)
        if (itemset.blocks && itemset.blocks.length && itemset.blocks.length > 0) await ItemSet.updateOne({ championId: payload.championId, role: roleName, gameMode: payload.gameMode, ...itemset }, { ...q, ...itemset }, { upsert: true }).exec();
    }

    return true;
  },
  postv2: async function(payload) {
    console.log(`Upload for champion ${payload.championId}, roles: ${Object.keys(payload.roles).join(', ')}`);

    for (const [roleName, role] of Object.entries(payload.roles)) {
      q = { championId: payload.championId, gameMode: role.gameMode, gameVersion: payload.gameVersion, role: roleName };

      if (role.summonerspells.length >= 2) await SummonerSpellList.updateOne({ championId: payload.championId, role: roleName, gameMode: role.gameMode, spells: role.summonerspells }, { ...q, spells: role.summonerspells }, { upsert: true });

      for (const perk of role.perks)
        if (perk.selectedPerkIds.length >= 6) await PerkPage.updateOne({ championId: payload.championId, role: roleName, gameMode: role.gameMode, selectedPerkIds: perk.selectedPerkIds }, { ...q, ...perk }, { upsert: true }).exec();
        else console.log("A perk page hasn't been uploaded because of missing perks");

      for (const itemset of role.itemsets)
        if (itemset.blocks && itemset.blocks.length && itemset.blocks.length > 0) await ItemSet.updateOne({ championId: payload.championId, role: roleName, gameMode: role.gameMode, ...itemset }, { ...q, ...itemset }, { upsert: true }).exec();
    }

    return true;
  }
}
