const server = require("./server");
const { DateTime } = require("luxon");

const url = process.env.BASE_URL || `https://${server.host}${server.port ? ':' + server.port : ''}`;

module.exports = {

  title: process.env.SITE_TITLE || "Dětská vodácká skupina ŠÁN",
  description: process.env.SITE_DESCRIPTION || "Skupina Šán je seskupení sedmi dětských vodáckých oddílů. Domovskou loděnici máme v Podolí mezi Žlutými lázněmi a botelem Racek naproti plaveckému bazénu.",
  mail: process.env.SITE_MAIL || "info@bosan.cz",

  url: url,

  image: {
    url: url + "/assets/img/share-default.jpg",
    width: 1280,
    height: 719
  }
}