import fs from "fs-extra";

import config from "../../config";

import Event from "../../models/event";

export default async function (eventId) {
  // delete the event's file data
  var eventDir = config.events.eventDir(eventId);
  await fs.remove(eventDir);

  // remove the event from database
  await Event.deleteOne({ _id: eventId });
}
