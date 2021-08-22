import server from "./server.js";
import general from "./general.js";

export default {
  domain: process.env.ICAL_DOMAIN || server.host,
  organizer: `${general.title} <${general.mail}>`,
};
