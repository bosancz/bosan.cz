const config = require("../../config");

module.exports = function(res){
  res.clearCookie(config.auth.cookieName);
}