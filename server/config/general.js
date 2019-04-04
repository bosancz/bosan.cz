const path = require("path");
const environment = require("../environment");

module.exports = {

  database: { useNewUrlParser: true },

  staticFiles: path.join(__dirname, "../../client/dist"),

  acl: {
    permissions: require("./permissions"),
    userRoles: req => req.user ? req.user.roles || [] : [],
    authenticated: req => !!req.user,
    defaultRole: "guest",
    logConsole: true,
    logString: event => `ACL ${event.result ? "OK" : "XX"} | permission: ${event.permission}, user: ${event.req.user ? event.req.user._id : "-"}, roles: ${event.req.user ? event.req.user.roles.join(",") : "-"}, ip: ${event.req.headers['x-forwarded-for'] || event.req.connection.remoteAddress}`
  },

  title: "Dětská vodácká skupina Šán",
  description: "Skupina Šán je seskupení sedmi dětských vodáckých oddílů. Domovskou loděnici máme v Podolí mezi Žlutými lázněmi a botelem Racek naproti plaveckému bazénu",
  contact: "admin@bosan.cz",

  mailing: {
    from: "Bošán Info <info@bosan.cz>"
  },

  uploads: {
    dir: "/tmp/uploads"
  },

  jwt: {    
    secret: environment.keys.jwt.secret,
    expiration: "30d",
    credentialsRequired: false,
    getToken: (req) => {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies["access_token"]) {
        return req.cookies.access_token;
      }
      return null;
    },
    cookieName: "access_token",
    cookieMaxAge: 1000 * 60 * 60 * 24 * 30
  },

  bcrypt: {
    rounds: 10
  },

  photos: {
    storageDir: albumId => path.join(__dirname, "../data/photos_original", String(albumId)),
    storageUrl: environment.url + "/data/photos_original",
    thumbsDir: albumId => path.join(__dirname, "../data/photos", String(albumId)),
    thumbsUrl: environment.url + "/data/photos",
    allowedTypes: ["jpg", "jpeg", "png", "gif"],
    sizes: {
      "big": [1280, 1024],
      "small": [1024, 340]
    }
  },

  events: {
    storageDir: path.join(__dirname, "../data/events"),
    eventDir: (eventId) => path.join(__dirname, "../data/events", String(eventId)),
    storageUrl: environment.url + "/data/events",

    accounting: {
      xlsx: path.join(__dirname, "../assets/uctovani-v6.xlsx")
    },

    announcement: {
      xlsx: path.join(__dirname, "../assets/ohlaska_pan_hlavni.xlsx")
    }
  },

  facebook: {
    app_id: environment.facebook.appId
  },

  google: {
    impersonate: "info@bosan.cz",
    clientAppId: "249555539983-j8rvff7bovgnecsmjffe0a3dj55j33hh.apps.googleusercontent.com",
    serviceMail: environment.keys.google.client_email,
    serviceClient : environment.keys.google.client_id,
    privateKey: environment.keys.google.private_key
  },

  ical: {
    domain: "bosan.cz",
    timezone: "Europe/Prague",
    organizer: "Bošán Info <info@bosan.cz>"
  }
}