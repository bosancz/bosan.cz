var express = require("express");
var router = module.exports = express.Router();

var apiRouter = require("./api");
router.use("/api", apiRouter);
