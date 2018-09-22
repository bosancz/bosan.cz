var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");
var bcrypt = require("bcryptjs");

var config = require("../../config");

var User = require("../models").User;

var mailings = require("../mailings");

var createToken = require("./login/create-token");

router.get("/", acl("users:list"), async (req,res,next) => {
  var users = User.find({}).select("_id member roles email");
  
  if(req.query.members) users.populate("member","_id nickname name group");
  
  res.json(await users);
});

router.get("/:id", acl("users:read"), async (req,res,next) => {
  const userId = req.params.id.toLowerCase();
  var user = User.findOne({_id:userId}).populate("member","_id nickname name group")
  res.json(await user);
});

router.put("/:id", acl("users:create"), async (req,res) => {
  
  // get the user data
  const userId = req.params.id.toLowerCase();
  const userData = {_id: userId, ...req.body};
  
  // choose the proper type for null member
  if(!userData.member) userData.member = null;
  // if there is password in the payload, hash it with bcrypt
	if(userData.password) userData.password = await bcrypt.hash(req.body.password, config.auth.bcrypt.rounds)
  // normalize email
  userData.password = userData.password.toLowerCase();
		
  // update or create the user
  var user = await User.create(userData);
  
  // send mail
  if(user.email) mailings("new-account", { user: user, validity: 10, token: createToken(user,"10 days") });
    
  // respond if succeeded
  res.sendStatus(204);
});

router.patch("/:id", acl("users:edit"), async (req,res) => {
  
  var userData = req.body;
  const userId = req.params.id.toLowerCase();

  // choose the proper type for null member
  if(!userData.member) userData.member = null;
  // if there is password in the payload, hash it with bcrypt
	if(userData.password) userData.password = await bcrypt.hash(userData.password, config.auth.bcrypt.rounds)
  // normalize email
  userData.password = userData.password.toLowerCase();
  
  // update the user
  await User.findOneAndUpdate({ _id: userId }, userData )
  
  // respond success
  res.sendStatus(204);
});

router.delete("/:id", acl("users:delete"), async (req,res) => {
  const userId = req.params.id.toLowerCase();
  await User.remove({_id:userId});
  res.sendStatus(204);
});