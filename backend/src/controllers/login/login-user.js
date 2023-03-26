var createToken = require("./create-token");
var saveCookie = require("./save-cookie");

module.exports = async function (res, user, impersonatedBy) {
  var token = await createToken(user, { impersonatedBy });

  saveCookie(res, token);

  return { access_token: token };
}