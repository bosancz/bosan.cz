const server = require("./server");
const { DateTime } = require("luxon");

module.exports = {

  title: process.env.SITE_TITLE,
  description: process.env.SITE_DESCRIPTION,
  mail: process.env.SITE_MAIL,

  url: process.env.BASE_URL || `https://${server.host}${server.port ? ':' + server.port : ''}`

}