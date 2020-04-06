module.exports = {

  expiration: "30d",

  jwt: {
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
  cookieMaxAge: 1000 * 60 * 60 * 24 * 30,
  cookieSecure: true,
  cookieSameSite: true,

  bcrypt: {
    rounds: 12
  }
};