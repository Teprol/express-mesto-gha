const serverErr = 500;
const notFound = 404;
const badRequest = 400;
const noAuth = 401;
const rightsErr = 403;
const dataAlready = 409;
const validUrl = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

module.exports = {
  serverErr,
  notFound,
  badRequest,
  noAuth,
  rightsErr,
  dataAlready,
  validUrl,
};
