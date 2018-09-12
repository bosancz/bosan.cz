var nodemailer = require("nodemailer");

var config = require("../../config");

module.exports = async function (mailingId,params){
  
  var mailing = require(`./${mailingId}/${mailingId}`);

  let transport = nodemailer.createTransport(config.mailing.transport,config.mailing.defaults);
  
  await mailing(transport,params);
  
  console.log(`Mailing ${mailingId} sent.`);
    
  transport.close();
};