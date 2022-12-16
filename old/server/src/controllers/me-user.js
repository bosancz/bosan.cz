const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var bcrypt = require("bcryptjs");

var validate = require("../validator");

var config = require("../config");

var User = require("../models/user");

routes.get("me:user","/",{permission:"me:user:read"}).handle(async (req,res,next) => {
  var user = await User.findOne({_id:req.user._id}).populate("member","_id nickname name group").toObject();
  if(!user) return res.sendStatus(404);
  
  req.routes.links(user,"user");
  res.json(user);
});