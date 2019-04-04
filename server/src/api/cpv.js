const { Routes } = require("@smallhillcz/routesjs");
const request = require("request-promise-native");
const cheerio = require('cheerio');
const { DateTime } = require("luxon");

const routes = module.exports = new Routes();

routes.get("cpv:kanoe","/kanoe.cz", {  }).handle(async (req,res) => {
  var cpvPage = await request({
    uri: "https://www.kanoe.cz/terminy/turistika",
    gzip: true
  });

  const $ = cheerio.load(cpvPage)

  const table = $("table").first();

  const events = [];

  table.find("tbody tr").each((i,elem) => {
    const name = $(elem).find("td").eq(0).text().trim();
    const date = $(elem).find("td").eq(1).text().trim();
    if(name && date){
      const match = date.match(/((\d+)\. ?((\d+)\.)?\-)?(\d+)\. ?(\d+)\. ?(\d+)$/);
      if(!match) return;

      const dateFrom = DateTime.fromObject({ year: Number(match[7]), month: Number(match[4] || match[6]), day: Number(match[2] || match[5]) });
      const dateTill = DateTime.fromObject({ year: Number(match[7]), month: Number(match[6]), day: Number(match[5]) });

      events.push({
        name: name,
        dateFrom: dateFrom.toISODate(),
        dateTill: dateTill.toISODate(),
        link: "https://www.kanoe.cz/terminy/turistika"
      });
    }
  });

  res.json(events)
});

routes.get("cpv:raft","/raft.cz", {  }).handle(async (req,res) => {
  var cpvPage = await request({
    uri: "https://www.raft.cz/export_akce.ashx"
  });

  const $ = cheerio.load(cpvPage, { xmlMode: true })

  const events = [];

  $("akce").each((i,elem) => {
    const name = $(elem).find("Nazev").text();
    var dateFrom = $(elem).find("Datum_od").text();
    var dateTill = $(elem).find("Datum_do").text();


    if(name && dateFrom){
      dateFrom = DateTime.fromFormat(dateFrom,"dd.LL.yyyy");
      dateTill = DateTime.fromFormat(dateTill,"dd.LL.yyyy");

      events.push({
        name: name,
        dateFrom: dateFrom.toISODate(),
        dateTill: dateTill.toISODate(),
        description: $(elem).find("Popis").text(),
        link: $(elem).find("Odkaz").text()
      });
    }
  });

  res.json(events)
});