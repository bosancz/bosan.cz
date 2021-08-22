import { Routes } from "@smallhillcz/routesjs";
import axios from "axios";
import cheerio from "cheerio";
import { DateTime } from "luxon";

const routes = (module.exports = new Routes());

routes.get("cpv", "/", {}).handle(async (req, res) => {
  const events = [];
  let i = 1;

  while (i <= 10) {
    try {
      var padlerResponse = await axios(
        `https://www.padler.cz/kalendar-akci/mesic/vse/rok/vse/lokalita/vse/typ-akce/1-2-5-9-17/strana/${i}/`,
        { responseType: "text" }
      );

      const $ = cheerio.load(padlerResponse.data, { xmlMode: true });

      $("a.trailLink").each((i, el) => {
        const name = $(el).find(".trailLink__title").text().trim();
        const link = $(el).attr("href");
        const dateFrom = $(el).find(".trailLink__date").attr("datetime");

        events.push({
          source: "padler",
          name,
          dateFrom,
          dateTill: dateFrom,
          link,
        });
      });

      i++;
    } catch (err) {
      break;
    }
  }

  res.json(events);
});
