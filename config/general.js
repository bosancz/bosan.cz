const path = require("path");

const environmentName = (process.env.NODE_ENV || "development");
const environment = require("./environment." + environmentName + ".js");


module.exports = {
  
  server: {
    port: environment.port,
    host: environment.host
  },
  
  url: environment.url,
  
  acl: {
    permissions: require("./permissions"),
    userRoles: req => req.user ? req.user.roles || [] : [],
    defaultRole: "guest",
    logConsole: true,
    logString: event => `ACL ${event.result ? "OK" : "XX"} | permission: ${event.permission}, user: ${event.req.user ? event.req.user._id : "-"}, roles: ${event.req.user ? event.req.user.roles.join(",") : "-"}, ip: ${event.req.headers['x-forwarded-for'] || event.req.connection.remoteAddress}`
  },
  
  title: "Dětská vodácká skupina Šán",
  description: "Skupina Šán je seskupení sedmi dětských vodáckých oddílů. Domovskou loděnici máme v Podolí mezi Žlutými lázněmi a botelem Racek naproti plaveckému bazénu",
  contact: "admin@bosan.cz",
  
  api: {
    root: environment.api_root + "/api",
    shareRoot: environment.api_root + "/api/share"
  },
  
  google: environment.google,
  
  notifications: {
    vapidKeys: require("./vapid")
  },
  
  mailing: {
    from: "Bošán Info <info@bosan.cz>"
  },
  
  versions: {
    "bosan.cz": "/var/www/bosan/bosan.cz",
    "bosan.cz-server": "/var/www/bosan/bosan.cz-server",
    "test.bosan.cz": "/var/www/bosan/test.bosan.cz",
    "test.bosan.cz-server": "/var/www/bosan/test.bosan.cz-server"
  },
  
  uploads: {
    dir: "/tmp/uploads"
  },
  
  auth: {
    jwt: {
      secret: environment.jwt_secret,
      expiration: "1 hour",
      credentialsRequired: false
    },

    bcrypt: {
      rounds: 10
    }
  },
  
  database: {
    uri: environment.database_uri,
    options:{
      useNewUrlParser: true
    }
  },
  
  photos: {
    storageDir: albumId => path.join(__dirname, "../data/photos_original", String(albumId)),
    storageUrl: environment.url + "/data/photos_original",
    thumbsDir: albumId => path.join(__dirname, "../data/photos", String(albumId)),
    thumbsUrl: environment.url + "/data/photos",
    allowedTypes: ["jpg","jpeg","png","gif"],
    sizes: {
      "big": [1024,1024],
      "small": [1024,340]
    }
  },
  
  events: {
    storageDir: path.join(__dirname, "../data/events"),
    eventDir: (eventId) => path.join(__dirname, "../data/events",String(eventId)),
    storageUrl: environment.url + "/data/events",

    accounting: {
      xlsx: path.join(__dirname,"../assets/uctovani-v6.xlsx")
    }
  },

  mongoExpress: environment.mongoExpress,
  
  facebook: {
    app_id: environment.facebook_app_id
  },
  
  ical: {
    domain: "bosan.cz",
    timezone: "Europe/Prague",
    organizer: "Bošán Info <info@bosan.cz>"
  }
}