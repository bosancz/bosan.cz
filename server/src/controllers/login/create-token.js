import jwt from "jsonwebtoken";

import config from "../../config";

import Member from "../../models/member";

export default async function createToken(user, options) {
  if (!options) options = {};

  const roles = user.roles || [];
  if (user._id) roles.push("user");

  const member = user.member ? await Member.findOne({ _id: user.member }).lean() : null;

  // set the token contents
  var accessTokenData = {
    _id: user._id,
    roles: roles,

    impersonatedBy: options.impersonatedBy,

    login: user.login || undefined,
    member: member ? member._id : undefined,
    group: member ? member.group : undefined,
  };

  return jwt.sign(accessTokenData, config.auth.jwt.secret, {
    expiresIn: options.expiration || config.auth.jwt.expiration,
  });
}
