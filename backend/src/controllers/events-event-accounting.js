const config = require("../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = (module.exports = new Routes());

const fs = require("fs-extra");
const path = require("path");
const xlsxPopulate = require("xlsx-populate");
const { DateTime } = require("luxon");

const multer = require("multer");
const upload = multer({ dest: config.uploads.dir });

const Event = require("../models/event");

routes.get("event:accounting", "/", { permission: "events:read" }).handle(async (req, res, next) => {
  const accountingPath = path.join(config.events.eventDir(req.params.id), "accounting.xlsx");
  if (await fs.pathExists(accountingPath)) res.sendFile(accountingPath);
  else res.sendStatus(404);
});

routes
  .post("event:accounting", "/", { permission: "events:edit" })
  .handle(upload.single("file"), async (req, res, next) => {
    var event = await Event.findOne({ _id: req.params.id });

    try {
      var file = req.file;
      if (!file) throw new Error("Missing file");

      var eventDir = path.join(config.events.storageDir, String(event._id));
      var originalPath = req.file.path;
      var storagePath = path.join(eventDir, "accounting.xlsx");

      await fs.ensureDir(eventDir);

      await fs.remove(storagePath);

      await fs.move(originalPath, storagePath);
    } catch (err) {
      err.name = "UploadError";
      throw err;
    }

    event.accounting = "accounting.xlsx";
    await event.save();

    res.sendStatus(204);
  });

routes.delete("event:accounting", "/", { permission: "events:edit" }).handle(async (req, res, next) => {
  var event = await Event.findOne({ _id: req.params.id });

  if (!event.accounting) return res.sendStatus(404);

  var accountingFile = path.join(config.events.storageDir, String(event._id), event.accounting);
  await fs.remove(accountingFile);

  event.accounting = null;
  await event.save();

  res.sendStatus(204);
});

routes.get("event:accounting-template", "/template", { permission: "events:read" }).handle(async (req, res, next) => {
  const query = Event.findOne({ _id: req.params.id }, {}, { autopopulate: false });
  query.select("name place dateFrom dateTill leaders attendees expenses");
  query.populate("leaders", "nickname name birthday address role");
  query.populate("attendees", "nickname name birthday address role");
  //query.filterByPermission("events:read");

  const event = await query;
  if (!event) return res.sendStatus(404);

  const xlsx = await xlsxPopulate.fromFileAsync(config.events.accounting.xlsx);

  const sheets = {
    attendees: xlsx.sheet("Seznam účastníků"),
    expenses: xlsx.sheet("Soupis výdajů"),
  };

  const leadersString =
    event.leaders[0] && event.leaders[0].name ? event.leaders[0].name.first + " " + event.leaders[0].name.last : "";

  const attendeeMembers = [...event.leaders, ...event.attendees];

  const missing = "Chybí v DB";

  const attendees = attendeeMembers.map((member) => [
    (member.name && member.name.first) || missing,
    (member.name && member.name.last) || missing,
    member.birthday || missing,
    member.address && (member.address.street || missing) + " " + (member.address.streetNo || ""),
    (member.address && member.address.city) || missing,
    (member.address && member.address.postalCode) || missing,
    member.role ? member.role.charAt(0) : missing,
  ]);

  attendees.sort((a, b) => b[6].localeCompare(a[6]) || a[1].localeCompare(b[1]));

  const expenses = event.expenses
    .sort((a, b) => a.id.localeCompare(b.id, "cs", { numeric: true }))
    .map((expense) => [expense.id, expense.description, expense.amount]);

  sheets.attendees.cell("A2").value(event.name || "");

  sheets.attendees.cell("B4").value(event.place || "");

  sheets.attendees.cell("B5").value(event.dateFrom || "");
  sheets.attendees.cell("B6").value(event.dateTill || "");
  sheets.attendees.cell("B7").value(leadersString);

  sheets.attendees.cell("A19").value(attendees);

  sheets.expenses.cell("B11").value(expenses);

  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");

  res.attachment(path.basename(config.events.accounting.xlsx));
  res.send(await xlsx.outputAsync());
});
