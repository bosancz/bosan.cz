const { Routes } = require("@smallhillcz/routesjs");
const axios = require("axios");
const cheerio = require('cheerio');
const { DateTime } = require("luxon");

const routes = module.exports = new Routes();

routes.get("cpv", "/", {}).handle(async (req, res) => {
  var padlerResponse = await axios("https://www.padler.cz/kalendar-akci/", { responseType: "text" });

  const $ = cheerio.load(padlerResponse.data, { xmlMode: true })

  const events = [];

  $("#groups tr").each((i, elem) => {
    const fields = $(elem).find("td");

    const name = fields.eq(1).find("a").text().trim();
    const link = fields.eq(1).find("a").attr("href");
    const dateFrom = fields.eq(0).find("a").text().trim();
    const dateParts = dateFrom.match(/(\d{2})\.&nbsp;(\d{2}).&nbsp;(\d{4})/, " ");


    if (name && dateParts) {

      const date = DateTime.fromObject({ year: dateParts[3], month: dateParts[2], day: dateParts[1] });

      events.push({
        source: "padler",
        name,
        dateFrom: date.toISODate(),
        dateTill: date.toISODate(),
        link: "https://padler.cz"+ link
      });
    }
  });

  res.json(events)
});