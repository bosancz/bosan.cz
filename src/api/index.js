const express = require("express");
const router = module.exports = express.Router();

const config = require("../../config");

router.use("/albums", require("./albums"));

router.use("/camps", require("./camps"));

router.use("/config", require("./config"));

router.use("/errors", require("./errors"));

router.use("/events", require("./events"));
router.use("/events/:event", require("./events-event"));
router.use("/events/:event/recurring", require("./events-event-recurring"));

router.use("/login", require("./login"));

router.use("/me", require("./me"));

router.use("/members", require("./members"));

router.use("/photos", require("./photos"));

router.use("/versions", require("./versions"));

router.use("/share", require("./share"));

router.get("/test", (req,res,next) => res.sendStatus(200));

router.use("/users", require("./users"));

// TODO: refactorize this into its own part, make logic around, maybe automatic creation, etc.
router.get("/", (req,res,next) => {
  res.json({
    
    "errors": {
      "_links": {
        "self": { href: `${config.api.root}/errors`, type: "json" }
      }
    },
    
    "events": {
      "_links": {
        "self": { href: `${config.api.root}/events{/_id}`, type: "json"},
        "upcoming": { href: `${config.api.root}/events/upcoming`, type: "json"},
        "program": { href: `${config.api.root}/events/program{?dateFrom,dateTill,limit}`, type: "json"}
      }
    }
  });
});