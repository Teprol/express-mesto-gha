const { badRequest } = require('../utils/constants');

class RightsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = badRequest;
  }
}

module.exports = RightsError;
