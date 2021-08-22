import fs from "fs-extra";
import path from "path";

import config from "../../config";
import Event from "../../models/event";

export default async function (eventData, eventFiles = [], options = {}) {
  var event = await Event.create(eventData);

  var eventDir = config.events.eventDir(String(event._id));

  await fs.mkdir(eventDir);

  for (var file of eventFiles) {
    if (options.copyFiles) await fs.copy(file, path.join(eventDir, path.basename(file)));
    else await fs.move(file, path.join(eventDir, path.basename(file)), { overwrite: true });
  }

  return event;
}
