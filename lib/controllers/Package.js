const Package = require('../models/Package');

module.exports = {
  get: async (req, h, q = { championId: req.params.championId }) => {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) throw Error('ChampionId must be a non-zero number');
    return await Package.findOne(q).select('-_id -__v').limit(1).lean().exec() || { statusCode: 404, error: "PERKS_NOT_FOUND", message: "Couldn't find perks" };
  },
  getByRole: async (req, h, q = { championId: req.params.championId }) => {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) throw Error('ChampionId must be a non-zero number');
    return await Package.find(q).select(`${req.params.role} championId gameMode`).limit(1).lean().exec() || { statusCode: 404, error: "PERKS_NOT_FOUND", message: "Couldn't find perks" };
  },
  post: async (req, h) => {
    if (!req.payload.roles) return { statusCode: 404, error: 'ROLES_NOT_FOUND', message: 'Data is incomplete' };

    Object.values(req.payload.roles).forEach(r => r.itemsets.map(x => x._data));
    console.dir(req.payload);

    try {
      await new Package(req.payload).save();
    }
    catch(err) {
      console.error(err);
      return throw Error('Internal Server Error');
    }

    return { statusCode: 200, message: 'SAVED', success: true };
  }
}
