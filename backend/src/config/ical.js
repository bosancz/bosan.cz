const server = require("./server");
const general = require("./general");

module.exports = {
  domain: process.env.ICAL_DOMAIN || server.host,
  organizer: `${general.title} <${general.mail}>`
}