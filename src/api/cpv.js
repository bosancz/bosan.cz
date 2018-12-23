const { Routes } = require("@smallhillcz/routesjs");
const request = require("request-promise-native");
const cheerio = require('cheerio');
const { DateTime } = require("luxon");

const routes = module.exports = new Routes();

routes.get("cpv","/", {  }).handle(async (req,res) => {
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
        dateTill: dateTill.toISODate()
      });
    }
  });
  
  res.json(events)
});