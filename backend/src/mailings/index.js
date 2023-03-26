var nodemailer = require("nodemailer");
const { google } = require("googleapis");

require("../google.js");

var config = require("../config");

function convertToBase64(string) {
  return Buffer.from(string.toString()).toString('base64');
}

function convertToBase64Safe(string) {
  return convertToBase64(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeAddress(string) {
  var matches = string.match(/^(.+) (<.+@.+>)$/);
  if (!matches) return string;
  return "=?utf-8?B?" + convertToBase64(matches[1]) + "?= " + matches[2];
}

function makeBody(options) {
  var str = `Content-Type: text/html; charset="UTF-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
To: ${options.to}
From: ${encodeAddress(config.google.impersonate)}
Subject: =?utf-8?B?${convertToBase64(options.subject)}?=

${options.message}`;

  return convertToBase64Safe(str);
}

module.exports = async function (mailingId, params) {

  var mailing = require(`./${mailingId}/${mailingId}`);

  const gmail = google.gmail({ version: 'v1' });

  var messageOptions = await mailing(params);

  var rawBody = makeBody(messageOptions)

  var mail = await gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: rawBody
    }
  });

};