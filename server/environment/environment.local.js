var path = require("path");

module.exports = {
  
  server: {
    port: 4300,
    host: "127.0.0.1"
  },

  cors: true,
  
  storage: {
    data: "../data",
    tmp: "../tmp"
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
  
  url: "http://localhost:4300",  
  
  google: {
    impersonate: "info@bosan.cz",
    appId: ""
  },

  facebook: {
    appId: ""
  },
  
  cookieSecure: false,
  
  databaseUri: "mongodb://localhost:27017/bosan-local"
}