var express = require("express");
var router = module.exports = express.Router();

router.use("/albums", require("./albums"));

router.use("/camps", require("./camps"));

router.use("/config", require("./config"));

router.use("/login", require("./login"));

router.use("/members", require("./members"));

router.use("/events", require("./events"));

router.use("/groups", require("./groups"));