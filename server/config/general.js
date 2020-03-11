const path = require("path");
const environment = require("../environment");

module.exports = {

  database: { useNewUrlParser: true },

  staticFiles: path.resolve(__dirname, "../../client/dist"),

  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["Location"]
  },

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
    dir: environment.uploads.dir,
    limit: environment.uploads.limit
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
    cookieMaxAge: 1000 * 60 * 60 * 24 * 30,
    cookieSecure: environment.cookieSecure,
    cookieSameSite: environment.cookieSameSite
  },

  bcrypt: {
    rounds: 10
  },

  photos: {
    storageDir: path.resolve(environment.storage.data, "photos_original"),
    storageUrl: environment.url + "/data/photos_original",
    albumStorageDirFn: albumId => path.join(environment.storage.data, "photos_original", String(albumId)),

    thumbsDir: path.resolve(environment.storage.data, "photos"),
    thumbsUrl: environment.url + "/data/photos",
    albumThumbsDirFn: albumId => path.join(environment.storage.data, "photos", String(albumId)),

    allowedTypes: ["jpg", "jpeg", "png", "gif"],
    sizes: {
      "big": [1280, 1024],
      "small": [1024, 340]
    }
  },

  events: {
    storageDir: path.resolve(environment.storage.data, "events"),
    eventDir: (eventId) => path.resolve(environment.storage.data, "events", String(eventId)),
    storageUrl: environment.url + "/data/events",

    accounting: {
      xlsx: path.resolve(__dirname, "../assets/uctovani-v6.xlsx")
    },

    announcement: {
      xlsx: path.resolve(__dirname, "../assets/ohlaska_pan_hlavni.xlsx")
    }
  },

  facebook: {
    app_id: environment.facebook.appId
  },

  google: {
    clientAppId: environment.google.appId,
    impersonate: environment.google.impersonate,

    serviceMail: environment.keys.google.client_email,
    serviceClient: environment.keys.google.client_id,
    privateKey: environment.keys.google.private_key
  },

  ical: {
    domain: "bosan.cz",
    timezone: "Europe/Prague",
    organizer: "Bošán Info <info@bosan.cz>"
  },

  config: {
    storageDir: path.resolve(environment.storage.data, "config")
  }
}