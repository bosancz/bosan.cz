var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");
var bcrypt = require("bcryptjs");

var config = require("../../config");

var User = require("../models/user");

router.get("/", acl("users:me:read"), async (req,res,next) => {
  var user = User.findOne({_id:req.user._id}).populate("member","_id nickname name group")
  res.json(await user);
});

router.patch("/", acl("users:me:edit"), async (req,res) => {
  
  var userData = req.body;
  
  // choose the proper type for null member
  if(!userData.member) userData.member = null;
  
  // if there is password in the payload, hash it with bcrypt
	if(userData.password) userData.password = await bcrypt.hash(userData.password, config.auth.bcrypt.rounds)
  
  // update the user
  await User.findOneAndUpdate({ _id: req.user._id }, userData )
  
  // respond success
  res.sendStatus(204);
});

router.delete("/:id", acl("users:me:delete"), async (req,res) => {
  await User.remove({_id:req.user._id});
  res.sendStatus(204);
});