var mustache = require("mustache");
var fs = require("fs-extra");

var config = require("../../../config");

module.exports = async function(params) {

  var template = await fs.readFile(__dirname + "/send-login-link.html","utf8");

  let loginLink = config.url + "/?token=" + params.token;
  
  return {
    to: params.user.email,
    subject: 'Přihlašovací odkaz na bosan.cz',
    message: mustache.render(template, {contact: config.contact, link: loginLink})
  };
}