var mustache = require("mustache");
var fs = require("fs-extra");

var config = require("../../../config");

module.exports = async function(transport,params) {

  var template = await fs.readFile(__dirname + "/send-login-link.html","utf8");

  let loginLink = config.url + "/ucet/admin/heslo?token=" + params.token;
  
  let mailOptions = {
    to: params.user.email,
    subject: 'Přihlašovací odkaz na bosan.cz',
    html: mustache.render(template, {contact: config.contact, link: loginLink})
  };
  
  return transport.sendMail(mailOptions);
}