const fs = require("fs-extra");
const cheerio = require("cheerio");
const path = require("path");
const iconv = require("iconv-lite");

const Event = require("../models/event");

const srcDir = "/home/kopec/bosan/old_events";

require("../db");

const dry = true;

async function main() {
  const files = (await fs.readdir(srcDir)).filter(file => file.match(/\9\d\.inc$/));

  for(let file of files){

    console.log("===");
    console.log("File: " + file);

    const fileParts = file.match(/^prog\d\-(\d{1,2})\-(\d{2})\.inc$/);
    var year = Number(fileParts[2]) > 20 ? Number("19" + fileParts[2]) : Number("20" + fileParts[2]);
    console.log("Trimester: " + fileParts[1] + " - " + year);

    const html = iconv.decode(await fs.readFile(path.join(srcDir,file)), "win1250");

    const $ = cheerio.load(html);

    const rows = $("table table tr");

    var dateTill,dateFrom;
    var rowspan = 0;

    for(let row of rows.toArray()){
      
      const tds = $(row).find("td");

      rowspan = tds.eq(0).attr("rowspan") ? Number(tds.eq(0).attr("rowspan")) : rowspan;

      const dateParts = tds.eq(0).text().match(/((\d{1,2})\. ?((\d{1,2})\.?)? ?\- ?)?(\d{1,2})\. ?(\d{1,2})\.?/)
      if(dateParts){
        const fromMonth = Number(dateParts[4] || dateParts[6]);
        dateTill = new Date(fromMonth === 12 && dateParts[6] < 12 ? year + 1 : year,Number(dateParts[6]) - 1,dateParts[5]);
        dateFrom = dateParts[2] ? new Date(year, fromMonth - 1, dateParts[2]) : dateTill;
      }
      else if(!rowspan) {
        dateTill = dateFrom = null;
      }

      const nameTd = tds.eq(rowspan && !tds.eq(0).attr("rowspan") ? 0 : 1);
      const name = nameTd.find("b,strong").toArray().map(item => $(item).text()).join(", ");

      const description = nameTd.clone().children().remove().end().text().trim() || nameTd.find("p").clone().children().remove().end().text().trim();

      if(name && dateFrom && dateTill){
        const eventData = {
          etl: "old_events",
          status: "public",
          name,
          dateFrom,
          dateTill,
          description
        };
        
        console.log(eventData);

        if(!dry) await Event.create(eventData)
        else console.log("Dry run nothing written.");
        
        
      }

      if(rowspan) rowspan--;

    }


  }
}

main()
  .then(() => process.exit());