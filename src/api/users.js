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
  var user = User.findOne({_id:req.params.id}).populate("member","_id nickname name group")
  res.json(await user);
});

router.put("/:id", acl("users:create"), async (req,res) => {
  
  // get the user data
  var userData = req.body;
  
  // choose the proper type for null member
  if(!userData.member) userData.member = null;
  // if there is password in the payload, hash it with bcrypt
	if(userData.password) userData.password = await bcrypt.hash(req.body.password, config.auth.bcrypt.rounds)
		
  // update or create the user
  var user = await User.findOneAndUpdate({_id:req.params.id}, userData, {upsert:true,new:true});
  
  // send mail
  if(user.email) mailings("new-account", { user: user, validity: 10, token: createToken(user,"10 days") });
    
  // respond if succeeded
  res.sendStatus(204);
});

router.patch("/:id", acl("users:edit"), async (req,res) => {
  
  var userData = req.body;
  
  // choose the proper type for null member
  if(!userData.member) userData.member = null;
  // if there is password in the payload, hash it with bcrypt
	if(userData.password) userData.password = await bcrypt.hash(userData.password, config.auth.bcrypt.rounds)
  
  // update the user
  await User.findOneAndUpdate({ _id: req.params.id }, userData )
  
  // respond success
  res.sendStatus(204);
});

router.delete("/:id", acl("users:delete"), async (req,res) => {
  await User.remove({_id:req.params.id});
  res.sendStatus(204);
});