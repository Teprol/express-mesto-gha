const { dataAlready } = require('../utils/constants');

class RightsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = dataAlready;
  }
}

module.exports = RightsError;
