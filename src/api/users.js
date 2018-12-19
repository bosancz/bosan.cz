const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var bcrypt = require("bcryptjs");

var config = require("../../config");

var User = require("../models").User;

var mailings = require("../mailings");

var createToken = require("./login/create-token");

routes.get("users","/",{permission:"users:list"}).handle(async (req,res,next) => {
  var query = User.find({}).select("_id login member roles email");
  if(req.query.members) query.populate("member","_id nickname name group");
  
  const users = await query.toObject();
  req.routes.links(users,"user");
  res.json(await users);
});

routes.post("users", "/",{permission:"users:create"}).handle(async (req,res) => {
  
  // get the user data
  const userData = req.body;
  
  // normalize
  userData.login = userData.login.toLowerCase();
  userData.email = userData.email.toLowerCase() || undefined;
  
  // choose the proper type for null member
  if(!userData.member) userData.member = null;
  // if there is password in the payload, hash it with bcrypt
	if(userData.password) userData.password = await bcrypt.hash(req.body.password, config.auth.bcrypt.rounds)
		
  // update or create the user
  var user = await User.create(userData);
  
  // send mail
  if(user.email) mailings("new-account", { user: user, validity: 10, token: createToken(user,"10 days") });
    
  res.location("/users/" + user._id);
  // respond if succeeded
  res.sendStatus(204);
});

routes.get("user", "/:id", {permission:"users:read"}).handle(async (req,res,next) => {
  var user = User.findOne({_id:req.params.id}).populate("member","_id nickname name group").toObject();
  
  console.log(await user);
  res.json(req.routes.links(await user,"user"));
});

routes.patch("user", "/:id", {permission:"users:edit"}).handle(async (req,res) => {
  
  var userData = req.body;
  
  // normalize
  if(userData.login) userData.login = userData.login.toLowerCase();
  if(userData.email) userData.email = userData.email.toLowerCase();

  // choose the proper type for null member
  if(!userData.member) userData.member = null;
  // if there is password in the payload, hash it with bcrypt
	if(userData.password) userData.password = await bcrypt.hash(userData.password, config.auth.bcrypt.rounds)  
  
  // update the user
  await User.findOneAndUpdate({ _id: req.params.id }, userData )
  
  // respond success
  res.sendStatus(204);
});

routes.delete("user", "/:id", {permission:"users:delete"}).handle(async (req,res) => {
  const userId = req.params.id.toLowerCase();
  await User.remove({_id:userId});
  res.sendStatus(204);
});

routes.post("user:impersonate","/:id/impersonate", { permission: "users:impersonate", hideRoot: true}).handle(async (req,res) => {
  
  const user = await User.findOne({_id: req.params.id}).lean();
  if(!user) return res.status(404).send("User not found.");

  var token = await createToken(user,config.auth.jwt.expiration);

  res.send(token);
});