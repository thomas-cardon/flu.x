const ProviderData = require('../models/ProviderData');

module.exports = {
  get: async (req, h) => {
    return await ProviderData.find({ championId: req.params.championId }).select('-_id -__v').limit(1).lean().exec() || { statusCode: 404, error: "PERKS_NOT_FOUND", message: "Couldn't find perks"
};
  },
  getByRole: async (req, h) => {
    return await ProviderData.find({ championId: req.params.championId, role: req.params.role })[0];
  },
  post: (req, h) => {
    const data = new ProviderData(req.payload);
    return data.save();
  }
}
