const config = require("../../../config");

module.exports = function(res){
  res.clearCookie(config.jwt.cookieName);
}