var express = require("express");
var router = module.exports = express.Router();
var path = require("path");

var apiRouter = require("./api");
router.use("/api", apiRouter);

router.get("/.well-known/security.txt",(req,res) => {
  res.sendFile(path.join(__dirname,"../assets/security.txt"));
});
