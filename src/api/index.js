var express = require("express");
var router = module.exports = express.Router();

router.use("/albums", require("./albums"));

router.use("/photos", require("./photos"));

router.use("/camps", require("./camps"));

router.use("/config", require("./config"));

router.use("/login", require("./login"));

router.use("/members", require("./members"));

router.use("/events/:event/recurring", require("./events-recurring"));
router.use("/events", require("./events"));

router.use("/me", require("./me"));
router.use("/users", require("./users"));

router.use("/versions", require("./versions"));

router.use("/share", require("./share"));

router.get("/test", (req,res,next) => res.sendStatus(200));
