const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../../config");

var bcrypt = require("bcryptjs");

var User = require("../models/user");

var mailings = require("../mailings");
var validate = require("../validator");
var google = require("../google");

var createToken = require("./login/create-token");
var saveCookie = require("./login/save-cookie");
var clearCookie = require("./login/clear-cookie");

var loginSchema = {
  type: "object",
  properties: {
    "login": {type: "string"},
    "password": {type: "string"}
  },
  required: ["login","password"]
};

routes.post("login","/",{permission:"login:credentials"}).handle(validate({body:loginSchema}), async (req,res,next) => {
  
  if(!req.body.login) return res.status(400).send("Missing login");
  if(!req.body.password) return res.status(400).send("Missing password");

  let login = req.body.login.toLowerCase();
  
  var user = await User.findOne({$or: [{login:login},{email:login}]}).select("+password").lean();

  if(!user) return res.sendStatus(401); // dont send that user dont exists
  if(!user.password) return res.status(503).send("Password not set."); // dont send user dont exists
  
  var same = await bcrypt.compare(req.body.password, user.password)

  if(!same) return res.sendStatus(401);
  
  // create the token
  var token = await createToken(user);

  // set cookie header
  saveCookie(res,token);
  
  // send it to the user
  res.send({ access_token: token });
  
  // if hash using weak hashing strength, then update hash
  if(bcrypt.getRounds(user.password) < config.auth.bcrypt.rounds) {

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
    "login": {type: "string"}
  },
  required: ["login"]
};

routes.post("login:sendlink","/sendlink",{permission:"login:sendlink"}).handle(validate({body:sendLinkSchema}), async (req,res) => {
	
	// we get the data from DB so we can update token data if something changed (e.g. roles)
  const userId = req.body.login.toLowerCase();
	var user = await User.findOne({$or: [{login:userId},{email: userId}]});
  
  if(!user || !user.email) return res.status(404).send("User not found");
  
  const token = await createToken(user,"1 hour");
  
  await mailings("send-login-link",{user: user, token: token });
  
  res.sendStatus(200);
	
});

routes.post("login:google","/google",{permission:"login:google"}).handle(async (req,res) => {
  
  var ticket;
  
  try{
    ticket = await google.jwtClient.verifyIdToken({
      idToken: req.body.token,
      audience: config.google.clientId
    });
  }
  catch(err){
    console.error("Invalid Google JWT token!",req.body.token);
    return res.status(401).send(err.message);
  }

  const payload = ticket.getPayload();
  
  const userEmail = payload.email.toLowerCase();

  const user = await User.findOne({email: userEmail});

  if(!user) return res.status(404).send("User with email " + userEmail + " not found");
  
  var token = await createToken(user);
  
  saveCookie(res,token);

  res.send({ access_token: token });
  
});


routes.post("login:impersonate","/impersonate", { permission: "login:impersonate" }).handle(async (req,res) => {
  
  if(!req.body.id) return res.status(400).send("Missing id.");
  
  const user = await User.findOne({_id: req.body.id}).lean();
  
  if(!user) return res.status(404).send("User not found.");

  var token = await createToken(user);
  
  saveCookie(res,token);

  res.send({ access_token: token });
});

routes.post("logout","/logout", { permission: "logout" }).handle(async (req,res) => {
  clearCookie(res);
  res.sendStatus(200);
});