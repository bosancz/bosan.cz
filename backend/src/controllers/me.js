const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var bcrypt = require("bcryptjs");

var validate = require("../validator");

var config = require("../config");

var User = require("../models/user");

routes.child("/user",require("./me-user"));
routes.child("/group",require("./me-group"));
routes.child("/events",require("./me-events"));
routes.child("/dashboard",require("./me-dashboard"));

routes.get("me","/",{permission:"me:read"}).handle(async (req,res,next) => {
  if(req.user) {
    const userData = {
      "_id": req.user._id,
      "roles": req.user._id,
      "member": req.user.member,
      "group": req.user.group
    };
    return res.json(userData);
  }
  else res.json({
    roles: ["guest"]
  });
});