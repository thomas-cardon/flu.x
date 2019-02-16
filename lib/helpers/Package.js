const { PerkPage, SummonerSpellList, ItemSet, Block } = require('../models');

module.exports = {
  findv1: async function(q, itemsets, summonerspells, maxPerkPages = 2) {
    const data = {}, roles = await PerkPage.find().distinct('role');

    for (let role of roles) {
      const spellsData = await SummonerSpellList.findOne({ ...q, role, spells: { $exists: true, $not: { $size: 0 }  } }).select('spells').lean();

      data[role] = {
        perks: await PerkPage.find({ championId: q.championId, role, selectedPerkIds: { $exists: true, $not: { $size: 0 }  } }).limit(maxPerkPages).select('-__v -_id -championId -gameMode -role -version -gameVersion').lean(),
        itemsets: !itemsets ? [] : await ItemSet.find({ ...q, role, "blocks.items": { $exists: true, $not: { $size: 0 } } }).limit(5).select('-__v -_id -championId -gameMode -role -version -gameVersion').lean(),
        summonerspells: summonerspells && spellsData ? spellsData.spells : []
      };

      if (data[role].perks.length === 0 || (itemsets && data[role].itemsets.length === 0) || (summonerspells && data[role].summonerspells.length === 0)) delete data[role];
    }

    if (Object.keys(data).length === 0 && data.constructor === Object) return { statusCode: 404, error: 'DATA_NOT_FOUND', message: 'There\'s no data available for this champion.' };

    return { roles: data, ...q, championId: parseInt(q.championId) };
  },
  bulkDownloadv1: async function() {
    const data = {};
    console.log(`Bulk download requested!`);

    for await (const doc of PerkPage.find({ selectedPerkIds: { $exists: true, $not: { $size: 0 }  } }).select('-__v -_id -version  -name').lean()) {
      if (!data[doc.championId]) data[doc.championId] = { championId: doc.championId, gameMode: doc.gameMode, gameVersion: doc.gameVersion, roles: { [doc.role || doc.gameMode]: { perks: [doc], itemsets: [], summonerspells: [] } } };
      else if (!data[doc.championId].roles[doc.role || doc.gameMode]) data[doc.championId].roles[doc.role || doc.gameMode] = { perks: [doc], itemsets: [], summonerspells: [] };
      else if (data[doc.championId].roles[doc.role || doc.gameMode].perks.length < 5) data[doc.championId].roles[doc.role || doc.gameMode].perks.push(doc);
    }

    for await (const doc of ItemSet.find({ 'blocks.items': { $exists: true, $not: { $size: 0 } } }).select('-__v -_id -version -name').lean()) {
      if (!data[doc.championId]) data[doc.championId] = { roles: { [doc.role || doc.gameMode]: { perks: [], itemsets: [doc], summonerspells: [] } }, championId: doc.championId, gameMode: doc.gameMode, gameVersion: doc.gameVersion };
      else if (!data[doc.championId].roles[doc.role || doc.gameMode]) data[doc.championId].roles[doc.role || doc.gameMode] = { perks: [], itemsets: [doc], summonerspells: [] };
      else if (data[doc.championId].roles[doc.role || doc.gameMode].itemsets.length < 5) data[doc.championId].roles[doc.role || doc.gameMode].itemsets.push(doc);
    }

    for await (const doc of SummonerSpellList.find({ spells: { $exists: true, $not: { $size: 0 }  } }).select('-__v -_id -version -name').lean()) {
      if (!data[doc.championId]) data[doc.championId] = { roles: { [doc.role || doc.gameMode]: { perks: [], itemsets: [], summonerspells: [doc] } }, championId: doc.championId, gameMode: doc.gameMode, gameVersion: doc.gameVersion };
      else if (!data[doc.championId].roles[doc.role || doc.gameMode]) data[doc.championId].roles[doc.role || doc.gameMode] = { perks: [], itemsets: [], summonerspells: [doc] };
      else if (data[doc.championId].roles[doc.role || doc.gameMode].summonerspells.length < 5) data[doc.championId].roles[doc.role || doc.gameMode].summonerspells.push(doc);
    }

    return data;
  },
  postv3: async function(payload) {
    console.log(`Upload >> Champion #${payload.championId}, roles: ${Object.keys(payload.roles).join(', ')}`);

    if (!this._isValidVersion(payload.gameVersion, payload.gameRegion)) {
      console.log(`Upload >> Cancelled because version is outdated`);
      return { errorCode: 'OUTDATED_VERSION', errorMessage: 'Data is outdated!' };
    }

    for (const [roleName, role] of Object.entries(payload.roles)) {
      let gameMode = roleName === 'ARAM' ? 'ARAM' : (role.gameMode || payload.gameMode);
      let q = { championId: payload.championId, gameMode, gameVersion: payload.gameVersion, gameRegion: payload.gameRegion, role: roleName };

      if (role.summonerspells.length >= 2) await SummonerSpellList.updateOne({ championId: payload.championId, role: roleName, gameMode, spells: role.summonerspells }, { ...q, spells: role.summonerspells }, { upsert: true });

      for (const perk of role.perks)
        if (perk.selectedPerkIds.length >= 6) await PerkPage.updateOne({ championId: payload.championId, role: roleName, gameMode, selectedPerkIds: perk.selectedPerkIds }, { ...q, ...perk }, { upsert: true }).exec();
        else console.log("A perk page hasn't been uploaded because of missing perks");

      for (const itemset of role.itemsets)
        if (itemset.blocks && itemset.blocks.length && itemset.blocks.length > 0) await ItemSet.updateOne({ championId: payload.championId, role: roleName, gameMode, ...itemset }, { ...q, ...itemset }, { upsert: true }).exec();
    }

    return true;
  }
}
