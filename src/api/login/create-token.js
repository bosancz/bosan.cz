var jwt = require('jsonwebtoken');

var config = require("../../../config");

module.exports = function createToken(user,validity){

  // set the token contents
  var tokenData = {
    _id: user._id,
    roles: user.roles || []
  };

  // set validity
  var tokenOptions = {
    expiresIn: validity
  };
  
  return jwt.sign(tokenData, config.auth.jwt.secret, tokenOptions);
}