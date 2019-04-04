var express = require("express");
var router = module.exports = express.Router();
var path = require("path");
var config = require("../config");

var apiRouter = require("./api");
router.use("/api", apiRouter);

router.get("/.well-known/security.txt",(req,res) => {
  res.sendFile(path.join(__dirname,"../assets/security.txt"));
});

router.use(express.static(config.staticFiles));

router.get("**",(req,res) => {
  res.sendFile(path.join(config.staticFiles,"index.html"));
})
