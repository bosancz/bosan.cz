var jwt = require('jsonwebtoken');

var config = require("../../../config");

var Member = require("../../models/member");

module.exports = async function createToken(user){

  const roles = user.roles || [];
  if(user._id) roles.push("user");

  const member = user.member ? await Member.findOne({_id: user.member}).lean() : null;

  // set the token contents
  var accessTokenData = {
    _id: user._id,
    roles: roles,

    login: user.login || undefined,
    member: member ? member._id : undefined,
    group: member ? member.group : undefined,
  };

  return jwt.sign(accessTokenData, config.auth.jwt.secret, { expiresIn: config.auth.jwt.expiration });

}