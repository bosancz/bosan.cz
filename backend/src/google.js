const { google } = require("googleapis");
const config = require("./config");

function getJWTClient() {
  try {

    if(!config.keys.google) throw new Error("Missing Google keys");

    var jwtClient = new google.auth.JWT(
      config.keys.google.client_email,
      null,
      config.keys.google.private_key,
      ['https://mail.google.com/'], // full access for now, we can restrict more
      config.google.impersonate
    );

    google.options({
      auth: jwtClient
    });

    console.log("[GOOGLE] Google API set up.");

    return jwtClient;
  }
  catch (err) {
    console.error("[GOOGLE] Could not set up Google API. Error: " + err.message)
    return undefined;
  }
}

module.exports = {
  jwtClient: getJWTClient(),
  google: google
};

