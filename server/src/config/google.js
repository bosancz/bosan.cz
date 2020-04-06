module.exports = {
  clientAppId: process.env.GOOGLE_APP_ID,
  impersonate: process.env.GOOGLE_IMPERSONATE || "interni@bosan.cz",

  serviceMail: process.env.GOOGLE_SERVICE_MAIL,
  serviceClient: process.env.GOOGLE_CLIENT_ID,
  privateKey: process.env.GOOGLE_PRIVATE_KEY
};