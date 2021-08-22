import mongoose from "mongoose";

import connection from "../../db";

import Event from "../../models/event";
import Member from "../../models/member";

const dry = false;

async function fixMemberDuplicates() {
  var members = await Member.find().select("_id nickname role inactive");

  for (let member of members) {
    if (member.role === "neaktivní") {
      member.inactive = true;
      member.role = "vedoucí";
      console.log("Updating member " + member.nickname + (dry ? " (DRY)" : ""));
      if (!dry) await member.save();
    }
  }

  console.log("Finished.");
}

/* RUN, FOREST, RUN */
Promise.resolve()
  .then(() => connection)
  .then(() => fixMemberDuplicates())
  .then(() => mongoose.disconnect().then(() => console.log("DB disconnected")))
  .then(() => process.exit())
  .catch((err) => {
    console.error("Error: " + err.name);
    console.error(err);
    process.exit(1);
  });
