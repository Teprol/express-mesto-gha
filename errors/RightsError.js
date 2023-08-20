const { rightsErr } = require('../utils/constants');

class RightsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = rightsErr;
  }
}

module.exports = RightsError;
