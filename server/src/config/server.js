module.exports = {

  port: process.env.SERVER_PORT || 3000,
  host: process.env.SERVER_HOST || "0.0.0.0",

  baseDir: process.env.BASE_DIR || "/api"

}