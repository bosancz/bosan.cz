import config from "../../config/index.js";

export default function (res) {
  res.clearCookie(config.auth.cookieName, {
    secure: config.auth.cookieSecure,
    httpOnly: true,
    maxAge: config.auth.cookieMaxAge,
    sameSite: config.auth.cookieSameSite,
  });
}
