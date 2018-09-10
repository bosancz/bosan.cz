var path = require("path");

module.exports = {
  
  port: 80,
  host: "127.0.0.1",
  
  api: {
    root: "/api",
    shareRoot: "https://example.com"
  },

  versions: {
    "name": "/path/to/dir"
  },

  uploads: {
    dir: "/tmp/uploads"
  },
  
  bcrypt: {
    rounds: 12
  },
  
  jwt: {
    secret: "top secret",
    expiration: "1 hour",
    credentialsRequired: false,
    defaultUserRole: "user"
  },
  
  database: {
    uri: "mongodb://localhost:27017/database",
    options:{
      useNewUrlParser: true
    }
  },
  
  photos: {
    storageDir: path.join(__dirname, "../data/photos_original"),
    storageUrl: "/data/photos_original",
    thumbsDir: path.join(__dirname, "../data/photos"),
    thumbsUrl: "/data/photos",
    allowedTypes: ["jpg","jpeg","png","gif"],
    sizes: {
      "big": [1024,1024],
      "small": [1024,340]
    }
  },
  
  events: {
    storageDir: path.join(__dirname, "../data/events"),
    eventDir: (eventId) => path.join(__dirname, "../data/events",eventId),
    storageUrl: "/data/events"
  },
  
  mongoExpress: {
    enabled: false,
    url: "/db",
    username: "username",
    password: "password",
    databases: ["database","database-test"]
  }
}