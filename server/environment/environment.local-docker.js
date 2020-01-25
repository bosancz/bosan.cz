var path = require("path");

module.exports = {
  
  server: {
    port: 3000,
    host: "0.0.0.0"
  },

  cors: false,
  
  storage: {
    data: "./data",
    tmp: "./tmp"
  },

  uploads: {
    limit: '10mb',
    dir: "./tmp"
  },

  keys: {
    google: {
      "private_key": "",
      "client_email": "",
      "client_id": "",
    },
    vapid: null,
    jwt: {
      secret: "secret"
    }
  },
  
  apiRoot: "/api",
  shareRoot: "/api/share",
  
  url: "",
  
  google: {
    impersonate: "info@bosan.cz",
    appId: ""
  },

  facebook: {
    appId: ""
  },
  
  cookieSecure: false,
  
  databaseUri: "mongodb://bosan:bosan@db.bosan/bosan?authSource=admin"
}