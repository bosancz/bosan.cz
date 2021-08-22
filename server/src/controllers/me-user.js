import { Routes } from "@smallhillcz/routesjs";
const routes = (module.exports = new Routes());

import bcrypt from "bcryptjs";

import validate from "../validator";

import config from "../config";

import User from "../models/user";

routes.get("me:user", "/", { permission: "me:user:read" }).handle(async (req, res, next) => {
  var user = await User.findOne({ _id: req.user._id }).populate("member", "_id nickname name group").toObject();
  if (!user) return res.sendStatus(404);

  req.routes.links(user, "user");
  res.json(user);
});
