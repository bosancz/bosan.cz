var nodemailer = require("nodemailer");
const {google} = require("googleapis"); 

var config = require("../../config");

const jwtClient = new google.auth.JWT(
  config.google.mail,
  null,
  config.google.privateKey,
  ['https://mail.google.com/'],
  undefined
);

module.exports = async function (mailingId,params){
  
  var mailing = require(`./${mailingId}/${mailingId}`);

  jwtClient.authorize((error, tokens) => {
    
    console.log(error,tokens);
    
    if(error) return;
    
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
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

    mailing(transport,params);

    console.log(`Mailing ${mailingId} sent.`);
    
    transport.close();
    
  });
  

};