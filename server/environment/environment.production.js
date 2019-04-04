var path = require("path");

module.exports = {
  
  
  server: {
    port: 3022,
    host: "127.0.0.1"
  },
  
  data: {
    root: "../../../bosan.cz-data"
  },

  keys: {
    google: require("../../../bosan.cz-keys/google"),
    vapid: require("../../../bosan.cz-keys/vapid"),
    jwt: require("../../../bosan.cz-keys/jwt")
  },
  
  apiRoot: "/api",
  shareRoot: "/api/share",
  
  url: "https://bosan.cz",  
  
  google: {
    impersonate: "info@bosan.cz",
    appId: "249555539983-j8rvff7bovgnecsmjffe0a3dj55j33hh.apps.googleusercontent.com"
  },

  facebook: {
    appId: "284020775534023"
  },
  
  cookieSecure: true,
  
  databaseUri: "mongodb://localhost:27017/bosan"
}