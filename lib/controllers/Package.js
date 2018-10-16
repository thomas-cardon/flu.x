const Package = require('../helpers/Package');

module.exports = {
  get: async (req, h, q = { championId: req.params.championId }) => {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) throw Error('ChampionId must be a non-zero number');
    return await Package.find(q, req.query.itemsets, req.query.summonerspells) || { statusCode: 404, error: 'DATA_MISSING', message: 'Missing data' };
  },
  getByRole: async (req, h, q = { championId: req.params.championId, role: req.params.role }) => {
    if (req.params.championId === 0 || !req.params.championId || isNaN(req.params.championId)) throw Error('ChampionId must be a non-zero number');
    return await Package.find(q);
  },
  post: async (req, h) => {
    if (!req.payload.roles) return { statusCode: 404, error: 'ROLES_NOT_FOUND', message: 'Data is incomplete' }
    return Package.post(req.payload) ? { statusCode: 200, message: 'SAVED', success: true } : { statusCode: 500, message: 'NOT_SAVED' };
  }
}
