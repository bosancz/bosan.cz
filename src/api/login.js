var express = require("express");
var router = module.exports = express.Router();

var bcrypt = require("bcryptjs");
var acl = require("express-dynacl");

var config = require("../../config");

var User = require("../models/user");

var mailings = require("../mailings");

var createToken = require("./login/create-token");

var loginSchema = {
  type: "object",
  properties: {
    "login": {type: "string", required: true},
    "password": {type: "string", required: true}
  }	
};

router.post("/", acl("login"), async (req,res,next) => {
  
  if(!req.body.login) return res.status(400).send("Missing login");
  if(!req.body.password) return res.status(400).send("Missing password");

  var user = await User.findOne({_id:req.body.login.toLowerCase()}).select("+password")

  if(!user) return res.sendStatus(401); // dont send user dont exists

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

router.get("/renew",acl("login:renew"), async (req,res) => {
	
	// we get the data from DB so we can update token data if something changed (e.g. roles)
	var user = await User.findOne({_id:req.user._id});
  
  if(!user) return res.status(404).send("User not found");
  
  // create the token
  var token = await createToken(user,config.auth.jwt.expiration);
  
  //send the new token to user
  res.send(token);
	
});

router.post("/sendlink",acl("login:sendlink"), async (req,res) => {
	
	// we get the data from DB so we can update token data if something changed (e.g. roles)
	var user = await User.findOne({_id:req.body._id});
  
  if(!user || !user.email) return res.status(404).send("User not found");
  
  await mailings("send-login-link",{user: user, token: createToken(user,"1 hour")});
  
  res.sendStatus(200);
	
});