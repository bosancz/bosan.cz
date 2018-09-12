var mustache = require("mustache");
var fs = require("fs-extra");

module.exports = async function(transport,params) {

  var template = await fs.readFile(__dirname + "/new-account.html","utf8");

  let loginLink = config.url + "/interni/ucet/heslo;token=" + params.token;
  
  return {
    to: params.user.email,
    subject: 'Tvůj účet na bosan.cz',
    html: mustache.render(template, {...params, link: loginLink})
  }
}