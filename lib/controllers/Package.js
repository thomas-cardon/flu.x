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
    if (!req.payload.roles) return { statusCode: 404, error: 'ROLES_NOT_FOUND', message: 'Data is incomplete' };

    console.dir(req.payload);
    Object.values(req.payload.roles).forEach(r => r.itemsets.map(x => x._data));

    try {
      await new Package(req.payload).save();
    }
    catch(err) {
      console.error(err);
      return { statusCode: 500, error: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' };
    }

    return { statusCode: 200, message: 'SAVED', success: true };
  }
}
