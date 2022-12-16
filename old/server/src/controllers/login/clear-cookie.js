const config = require("../../config");

module.exports = function (res) {
  res.clearCookie(config.auth.cookieName, {
    secure: config.auth.cookieSecure,
    httpOnly: true,
    maxAge: config.auth.cookieMaxAge,
    sameSite: config.auth.cookieSameSite,
  });
};
