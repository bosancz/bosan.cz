const {google} = require("googleapis"); 
const path = require("path");
const config = require("../config");

async function main () {

  const jwtClient = new google.auth.JWT(
    config.google.serviceMail,
    null,
    config.google.privateKey,
    ['https://mail.google.com/'], //full access for now, we can restrict more
    config.google.impersonate
  );
  
  google.options({
    auth: jwtClient
  });
  
  console.log("Google API connected.");
}

main().catch(console.error);