const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var Group = require("../models/group");
var Member = require("../models/member");

routes.router.use("/", (req,res,next) => {
  if(!req.user.group) return res.status(400).send("User not assigned to a group.");
  next();
});

routes.get("me:group","/",{permission:"me:group:read"}).handle(async (req,res,next) => {
  const group = await Group.findOne({_id:req.user.group})
  req.routes.links(group,"group");
  res.json(group);
});

routes.get("me:group","/members",{permission:"me:group:members:list"}).handle(async (req,res) => {
  const members = await Member.find({group:req.user.group});
  req.routes.links(members,"member");
  res.json(members);
});