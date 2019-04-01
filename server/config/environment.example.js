var path = require("path");

module.exports = {
  
  port: 80,
  host: "127.0.0.1",
  
  cors: true,
  
  url: "https://test.bosan.cz",  
  
  google: {
    impersonate: "",
    serviceMail: "",
    serviceClient : "",
    privateKey: "",
    clientAppId: ""
  },
  
  jwt_secret: "",
  
  cookieSecure: true,
  
  database_uri: "mongodb://localhost:27017/database",
  
  mongoExpress: {
    enabled: true,
    url: "/db",
    username: "",
    password: "",
    databases: ["database"]
  },
  
  facebook_app_id: ""
}