const config = require("../../../config");

module.exports = function(res,token){
  res.cookie(config.auth.jwt.cookieName,token, { secure: config.auth.jwt.cookieSecure, httpOnly: true, maxAge: config.auth.jwt.cookieMaxAge } ); 
}