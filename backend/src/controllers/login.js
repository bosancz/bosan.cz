const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const axios = require("axios");
const { DateTime } = require("luxon");

const config = require("../config");

var bcrypt = require("bcryptjs");

var User = require("../models/user");

var mailings = require("../mailings");
var validate = require("../validator");
var google = require("../google");

var createToken = require("./login/create-token");
var loginUser = require("./login/login-user");
var saveCookie = require("./login/save-cookie");
var clearCookie = require("./login/clear-cookie");

var loginSchema = {
  type: "object",
  properties: {
    "login": { type: "string" },
    "password": { type: "string" }
  },
  required: ["login", "password"]
};

routes.post("login", "/", { permission: "login:credentials" }).handle(validate({ body: loginSchema }), async (req, res, next) => {

  if (!req.body.login) return res.status(400).send("Missing login");
  if (!req.body.password) return res.status(400).send("Missing password");

  let login = req.body.login.toLowerCase();

  var user = await User.findOne({ $or: [{ login: login }, { email: login }] }).select("+password").lean();

  if (!user) return res.sendStatus(401); // dont send that user dont exists
  if (!user.password) return res.status(503).send("Password not set."); // dont send user dont exists

  var same = await bcrypt.compare(req.body.password, user.password);

  if (!same) return res.sendStatus(401);

  // create the token
  var tokens = await loginUser(res, user);

  // send it to the user
  res.send(tokens);

  // if hash using weak hashing strength, then update hash
  if (bcrypt.getRounds(user.password) < config.auth.bcrypt.rounds) {

    // we dont need to wait for this, rather return token faster
    bcrypt.hash(req.body.password, config.auth.bcrypt.rounds)
      .then(hash => {
        user.password = hash;
        user.save();
      })
      .catch(err => console.error(err.message));
  }

});

var sendLinkSchema = {
  type: "object",
  properties: {
    "login": { type: "string" }
  },
  required: ["login"]
};

routes.post("login:sendlink", "/sendlink", { permission: "login:link" }).handle(validate({ body: sendLinkSchema }), async (req, res) => {

  // we get the data from DB so we can update token data if something changed (e.g. roles)
  const userId = req.body.login.toLowerCase();
  var user = await User.findOne({ $or: [{ login: userId }, { email: userId }] });

  if (!user || !user.email) return res.status(404).send("User not found");

  const code = await axios.get("https://www.random.org/strings/?num=2&len=16&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new", { responseTYpe: "text" })
    .then(codes => codes.replace(/\r?\n/g, ""))
    .catch(err => [...Array(32)].map(i => (~~(Math.random() * 36)).toString(36)).join(''));

  user.loginCode = code;
  user.loginCodeExp = DateTime.local().plus({ hours: 1 }).toJSDate();

  await user.save();

  const link = `${config.general.url}${config.server.baseDir}/login/link?code=${code}`;

  await mailings("send-login-link", { user: user, link: link });

  res.sendStatus(200);

});

routes.get("login:link", "/link", { permission: "login:link" }).handle(async (req, res) => {

  var user = await User.findOne({ loginCode: req.query.code });

  if (!user || !user.email) return res.status(404).send("Login code not valid");

  if (!user.loginCodeExp || DateTime.fromJSDate(user.loginCodeExp) < DateTime.local()) {
    return res.status(403).send("Login code expired")
  }

  await loginUser(res, user);

  res.redirect("/");

  // reset login code
  user.loginCode = null;
  user.loginCodeExp = null;
  await user.save();

});

routes.post("login:google", "/google", { permission: "login:google" }).handle(async (req, res) => {

  var ticket;

  try {
    ticket = await google.jwtClient.verifyIdToken({
      idToken: req.body.token,
      audience: config.google.clientId
    });
  }
  catch (err) {
    console.error("Invalid Google JWT token!", req.body.token);
    return res.status(401).send(err.message);
  }

  const payload = ticket.getPayload();

  const userEmail = payload.email.toLowerCase();

  const user = await User.findOne({ email: userEmail });

  if (!user) return res.status(404).send("User with email " + userEmail + " not found");

  const tokens = await loginUser(res, user);

  res.send(tokens);

});


routes.post("login:impersonate", "/impersonate", { permission: "login:impersonate" }).handle(async (req, res) => {

  if (!req.body.id) return res.status(400).send("Missing id.");

  const user = await User.findOne({ _id: req.body.id }).lean();

  if (!user) return res.status(404).send("User not found.");

  const tokens = await loginUser(res, user, req.user._id);

  res.send(tokens);
});

routes.post("logout", "/logout", { permission: "logout" }).handle(async (req, res) => {

  if (req.user && req.user.impersonatedBy) {
    const user = await User.findOne({ _id: req.user.impersonatedBy });
    if (user) {
      await loginUser(res, user);
      return res.sendStatus(200);
    }
  }

  clearCookie(res);
  res.sendStatus(200);
});