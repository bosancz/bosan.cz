module.exports = {
  uri: process.env.DATABASE_URI || "mongodb://localhost:27017/bosan",
  retryCount: 10,
  retryInterval: 10000

}