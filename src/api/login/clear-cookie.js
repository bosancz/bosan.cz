const config = require("../../../config");

module.exports = function(res){
  res.clearCookie(config.auth.jwt.cookieName);
}