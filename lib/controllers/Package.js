const Package = require('../models/Package');

module.exports = {
  get: async (req, h, q = { championId: req.params.championId }) => {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) return { statusCode: 401, error: "CHAMPION_ID_NAN", message: "ChampionId must be a non-zero number" };
    return await Package.findOne(q).select('-_id -__v').limit(1).lean().exec() || { statusCode: 404, error: "PERKS_NOT_FOUND", message: "Couldn't find perks" };
  },
  getByRole: async (req, h, q = { championId: req.params.championId }) => {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) return { statusCode: 401, error: "CHAMPION_ID_NAN", message: "ChampionId must be a non-zero number" };
    return await Package.find(q).select(`${req.params.role} championId gameMode`).limit(1).lean().exec() || { statusCode: 404, error: "PERKS_NOT_FOUND", message: "Couldn't find perks" };
  },
  post: async (req, h) => {
    console.dir(req.payload);
    Object.values(req.payload.roles).forEach(r => r.itemsets.map(x => x._data));
    return await new Package(req.payload).save();
  }
}
