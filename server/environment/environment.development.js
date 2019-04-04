var path = require("path");

module.exports = {
  
  
  server: {
    port: 3023,
    host: "127.0.0.1"
  },

  keys: {
    google: require("../../../keys-test/google"),
    vapid: require("../../../keys-test/vapid"),
    jwt: require("../../../keys-test/jwt")
  },
  
  apiRoot: "/api",
  shareRoot: "/api/share",
  
  url: "https://test.bosan.cz",  
  
  google: {
    impersonate: "info@bosan.cz",
    appId: ""
  },

  facebook: {
    appId: ""
  },
  
  cookieSecure: false,
  
  databaseUri: "mongodb://localhost:27017/bosan-test"
}