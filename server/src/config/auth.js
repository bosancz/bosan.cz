const { Duration } = require("luxon");

const expiration = Duration.fromISO(process.env.AUTH_EXPIRATION || "P1D");

module.exports = {

  jwt: {
    expiration: expiration.as("seconds"),
    secret: process.env.AUTH_SECRET || "secret",
    credentialsRequired: false,

    getToken: (req) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies["access_token"]) {
        return req.cookies.access_token;
      }
      return null;
    },
  },

  cookieName: "access_token",
  cookieMaxAge: expiration.as("milliseconds"),
  cookieSecure: true,
  cookieSameSite: true,

  bcrypt: {
    rounds: 12
  }
};