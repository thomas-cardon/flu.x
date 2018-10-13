const Report = require('../models/Report');

module.exports = {
  postReport: async (req, h) => {
    await new Report(req.payload).save();
    return { statusCode: 200, message: 'SAVED', success: true };
  }
}
