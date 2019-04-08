const config = require("../../../config");

module.exports = function(res,token){
  res.cookie(config.jwt.cookieName,token, { secure: config.jwt.cookieSecure, httpOnly: true, maxAge: config.jwt.cookieMaxAge } ); 
}