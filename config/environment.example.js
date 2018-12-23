var path = require("path");

module.exports = {
  
  port: 80,
  host: "127.0.0.1",
  
  url: "https://test.bosan.cz",  
  
  google: {
    impersonate: "",
    serviceMail: "",
    serviceClient : "",
    privateKey: "",
    clientAppId: ""
  },
  
  jwt_secret: "",
  
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