var mustache = require("mustache");
var fs = require("fs-extra");

var config = require("../../config");

module.exports = async function (params) {
  var template = await fs.readFile(__dirname + "/event-prepared.html", "utf8");

  if (!config.notifications.mails.program) {
    console.warn("Missing mail for program notification.");
    return;
  }

  return {
    to: config.notifications.mails.program,
    subject: "Akce ke schválení",
    message: mustache.render(template, params),
  };
};
