var path = require("path");

module.exports = {
  
  
  server: {
    port: 80,
    host: "127.0.0.1"
  },
  
  data: {
    root: "/var/www/bosan/data-test"
  },

  keys: {
    google: require("../../../keys/google"),
    vapid: require("../../../keys/vapid"),
    jwt: require("../../../keys/jwt")
  },
  
  apiRoot: "/api",
  shareRoot: "/api/share",
  
  url: "https://test.bosan.cz",  
  
  google: {
    impersonate: "info@bosan.cz",
    appId: ""
  },

  facebook: {
    appId: "284020775534023"
  },
  
  cookieSecure: false,
  
  databaseUri: "mongodb://localhost:27017/bosan-test"
}