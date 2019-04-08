const express = require("express");
const router = module.exports = express.Router();
const path = require("path");

const config = require("../config");
const environment = require("../environment");

var apiRouter = require("./api");
router.use("/api", apiRouter);

router.get("/.well-known/security.txt",(req,res) => {
  res.sendFile(path.join(__dirname,"../assets/security.txt"));
});

router.use(express.static(config.staticFiles));

router.use("/data",express.static(environment.storage.data));

router.get("**",(req,res) => {
  res.sendFile(path.join(config.staticFiles,"index.html"));
})
