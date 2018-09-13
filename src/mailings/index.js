var nodemailer = require("nodemailer");
const {google} = require("googleapis"); 

var config = require("../../config");

const jwtClient = new google.auth.JWT({
  email: config.google.mail,
  key: config.google.privateKey,
  scopes: 'https://mail.google.com/'
});

module.exports = async function (mailingId,params){

  var mailing = require(`./${mailingId}/${mailingId}`);

  var tokens = await jwtClient.authorize();
  
  console.log(tokens);

  var transport = nodemailer.createTransport({
    service:"Gmail",
    auth: {
      type: 'OAuth2',
      user: config.google.mail,
      serviceClient: config.google.serviceClient,
      privateKey: config.google.privateKey,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expires: tokens.expiry_date
    }
  });

  await mailing(transport,params);

  console.log(`Mailing ${mailingId} sent.`);

  transport.close();


};