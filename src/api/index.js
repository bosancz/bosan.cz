const express = require("express");

const { Routes } = require("../../lib/routes");

const config = require("../../config");

const routes = new Routes({url:config.api.root + "/groups", rootEndpoint:true});
const router = module.exports = routes.router;


router.use("/albums", require("./albums"));

router.use("/camps", require("./camps"));

router.use("/config", require("./config"));

router.use("/errors", require("./errors"));

router.use("/events", require("./events"));
router.use("/events/:event", require("./events-event"));
router.use("/events/:event/recurring", require("./events-event-recurring"));

router.use("/groups", require("./groups"));

router.use("/login", require("./login"));

router.use("/my/groups", require("./my-groups"));
router.use("/me", require("./me"));

router.use("/members", require("./members"));

router.use("/payments", require("./payments"));

router.use("/photos", require("./photos"));

router.use("/program", require("./program"));

router.use("/versions", require("./versions"));

router.use("/share", require("./share"));

router.get("/test", (req,res,next) => res.sendStatus(200));

router.use("/users", require("./users"));
