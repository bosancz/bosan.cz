const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const config = require("../../config");

var bcrypt = require("bcryptjs");

var User = require("../models/user");

var mailings = require("../mailings");
var validate = require("../validator");
var google = require("../google");

var createToken = require("./login/create-token");

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
  
  var user = await User.findOne({$or: [{login:login},{email:login}]}).select("+password")

  if(!user) return res.sendStatus(401); // dont send that user dont exists
  if(!user.password) return res.status(503).send("Password not set."); // dont send user dont exists
  
  var same = await bcrypt.compare(req.body.password, user.password)

  if(!same) return res.sendStatus(401);

  // create the token
  var token = await createToken(user,config.auth.jwt.expiration);

  // send it to the user
  res.send(token);
  
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

routes.post("login:renew","/renew",{permission:"login:renew"}).handle(async (req,res) => {
	
	// we get the data from DB so we can update token data if something changed (e.g. roles)
  const user = await User.findOne({_id:req.user._id});
  
  if(!user) return res.status(404).send("User not found");
  
  // create the token
  var token = await createToken(user,config.auth.jwt.expiration);
  
  //send the new token to user
  res.send(token);
	
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
  
  await mailings("send-login-link",{user: user, token: createToken(user,"1 hour")});
  
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

  var token = await createToken(user,config.auth.jwt.expiration);

  res.send(token);
  
});

var loginImpersonateSchema = {
  type: "object",
  properties: {
    "_id": {type: "string"},
    "roles": {type: "array", items: { type: "string" } }
  },
  additionalProperties: false
};

routes.post("login:impersonate","/impersonate", { permission: "login:impersonate"}).handle(validate({body:loginImpersonateSchema}), async (req,res) => {
  
  let user = {};
  
  if (req.body._id) {
    user = await User.findOne({_id: req.body._id}).lean();
    if(!user) return res.status(404).send("User not found.");
  }
  
  if (req.body.roles) {
    user.roles = req.body.roles;
  }
  
  var token = await createToken(user,config.auth.jwt.expiration);

  res.send(token);
});