var jwt = require('jsonwebtoken');

var config = require("../../../config");

var Member = require("../../models/member");

module.exports = async function createToken(user,validity){

  const roles = user.roles || [];
  if(user._id) roles.push("user");
  
  const member = await Member.findOne({_id: user.member}).lean();
  
  // set the token contents
  var tokenData = {
    _id: user._id,
    roles: roles,
    
    login: user.login || undefined,
    member: member ? member._id : undefined,
    group: member ? member.group : undefined,
  };

  // set validity
  var tokenOptions = {
    expiresIn: validity
  };
  
  return jwt.sign(tokenData, config.auth.jwt.secret, tokenOptions);
}