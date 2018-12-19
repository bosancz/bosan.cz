const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var bcrypt = require("bcryptjs");

var validate = require("../validator");

var config = require("../../config");

var User = require("../models/user");

routes.get("me:user","/",{permission:"me:user:read"}).handle(async (req,res,next) => {
  var user = await User.findOne({_id:req.user._id}).populate("member","_id nickname name group").toObject();
  req.routes.links(user,"user");
  res.json(user);
});

routes.patch("me:user","/",{permission:"me:user:edit"}).handle(async (req,res) => {
  
  var userData = req.body;
 
  // if there is password in the payload, hash it with bcrypt
  userData.password = await bcrypt.hash(userData.password, config.auth.bcrypt.rounds)

  // update the user
  await User.findOneAndUpdate({ _id: req.user._id }, userData )

  // respond success
  res.sendStatus(204);
});