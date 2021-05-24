const config = require("../../config");

module.exports = function (res, token) {
  res.cookie(config.auth.cookieName, token, {
    secure: config.auth.cookieSecure,
    httpOnly: true,
    maxAge: config.auth.cookieMaxAge,
    sameSite: config.auth.cookieSameSite,
  });
};
