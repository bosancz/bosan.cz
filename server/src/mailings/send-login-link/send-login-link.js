import mustache from "mustache";
import fs from "fs-extra";

import config from "../../config";

export default async function (params) {
  var template = await fs.readFile(__dirname + "/send-login-link.html", "utf8");

  return {
    to: params.user.email,
    subject: "Přihlašovací odkaz na bosan.cz",
    message: mustache.render(template, { contact: config.general.mail, link: params.link }),
  };
}
