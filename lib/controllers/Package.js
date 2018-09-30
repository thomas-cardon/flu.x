const Package = require('../models/Package');

module.exports = {
  get: async (req, h) => {
    return await Package.find({ championId: req.params.championId }).select('-_id -__v').limit(1).lean().exec() || { statusCode: 404, error: "PERKS_NOT_FOUND", message: "Couldn't find perks" };
  },
  getByRole: async (req, h) => {
    return await Package.find({ championId: req.params.championId }).select(`${req.params.role} championId providerId gameMode`).limit(1).lean().exec() || { statusCode: 404, error: "PERKS_NOT_FOUND", message: "Couldn't find perks" };
  },
  post: async (req, h) => {
    return await new Package(req.payload).save();
  }
}
