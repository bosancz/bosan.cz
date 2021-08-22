import mustache from "mustache";
import fs from "fs-extra";

import config from "../../config";

export default async function (transport, params) {
  var template = await fs.readFile(__dirname + "/new-account.html", "utf8");

  let loginLink = config.general.url + "/interni/ucet/heslo?token=" + params.token;

  let mailOptions = {
    to: params.user.email,
    subject: "Tvůj účet na bosan.cz",
    html: mustache.render(template, { ...params, link: loginLink, contact: config.contact }),
  };

  return transport.sendMail(mailOptions);
}
