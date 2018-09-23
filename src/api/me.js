var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");
var bcrypt = require("bcryptjs");

var validate = require("../validator");

var config = require("../../config");

var User = require("../models/user");

router.get("/", acl("users:me:read"), async (req,res,next) => {
  var user = User.findOne({_id:req.user._id}).populate("member","_id nickname name group")
  res.json(await user);
});

router.patch("/", acl("users:me:edit"), async (req,res) => {
  
  var userData = req.body;
 
  // password is not edited here, but in /:id/password
  delete userData.password;
  
  // update the user
  await User.findOneAndUpdate({ _id: req.user._id }, userData )
  
  // respond success
  res.sendStatus(204);
});

var passwordChangeSchema = {
  type: "object",
  properties: {
    "password": {type: "string"},
    "password_old": {type: "string"}
  },
  additionalProperties:false
};

router.post("/password", validate({body: passwordChangeSchema}), acl("users:me:edit"), async (req,res) => {

  if(!req.body.password) return res.status(400).send("Missing password.");
  if(!req.body.password.match(/.{8,}/)) return res.status(400).send("Password shorter that 8 characters.");
  
  console.log(req.user);
  
  var user = await User.findOne({ _id: req.user._id }).select("+password");
  
  // if there is password in the payload, hash it with bcrypt
	user.password = await bcrypt.hash(req.body.password, config.auth.bcrypt.rounds)
  
  await user.save();
  
  res.sendStatus(204);
  
});