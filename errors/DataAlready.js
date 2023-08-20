const { dataAlready } = require('../utils/constants');

class DataAlready extends Error {
  constructor(message) {
    super(message);
    this.statusCode = dataAlready;
  }
}

module.exports = DataAlready;
