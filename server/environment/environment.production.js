var path = require("path");

module.exports = {
  
  
  server: {
    port: 3022,
    host: "127.0.0.1"
  },

  keys: require("../../keys"),
  
  apiRoot: "/api",
  shareRoot: "/api/share",
  
  url: "https://bosan.cz",  
  
  google: {
    impersonate: "info@bosan.cz",
    appId: ""
  },

  facebook: {
    appId: ""
  },
  
  cookieSecure: true,
  
  databaseUri: "mongodb://localhost:27017/bosan"
}