const {google} = require("googleapis"); 
const config = require("./config");


const jwtClient = new google.auth.JWT(
  config.google.serviceMail,
  null,
  config.google.privateKey,
  ['https://mail.google.com/'], // full access for now, we can restrict more
  config.google.impersonate
);

google.options({
  auth: jwtClient
});

console.log("[GOOGLE] Google API set up.");

module.exports = {
  jwtClient: jwtClient,
  google: google
};

