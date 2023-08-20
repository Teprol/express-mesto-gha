const { noAuth } = require('../utils/constants');

class NoAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = noAuth;
  }
}

module.exports = NoAuthError;
