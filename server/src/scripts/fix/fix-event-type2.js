import mongoose from "mongoose";

import connection from "../db";

import Event from "../models/event";

Event.find()
  .select("_id type subtype")
  .then((events) =>
    Promise.all(
      events.map((event) => {
        //event.srcType = event.type;
        if (event.subtype && ["schůzka", "bazén", "exkurze"].indexOf(event.subtype) !== -1) {
          event.type = "schůzka";

          return event.save();
        }
      })
    )
  )
  .then(() => console.log("Finished"))
  .then(() => process.exit());
