const express = require("express");

const { Routes, RoutesLinks } = require("@smallhillcz/routesjs");

const config = require("../../config");

const routes = new Routes({url:"/"});
const router = module.exports = routes.router;

routes.child("/albums", require("./albums"));

routes.child("/config", require("./config"));

routes.child("/cpv", require("./cpv"));

routes.child("/errors", require("./errors"));

routes.child("/events", require("./events"));
routes.child("/events/:id/recurring", require("./events-event-recurring"));
routes.child("/events/:id", require("./events-event"));

routes.child("/gallery", require("./gallery"));

routes.child("/groups", require("./groups"));

routes.child("/login", require("./login"));

routes.child("/me", require("./me"));

routes.child("/members", require("./members"));

routes.child("/notifications", require("./notifications"));

routes.child("/payments", require("./payments"));

routes.child("/photos", require("./photos"));

routes.child("/program", require("./program"));

routes.child("/share", require("./share"));

routes.child("/users", require("./users"));

routes.router.get("/test", (req,res,next) => res.sendStatus(200));

routes.get(null,"/",{permission:"api:read"}).handle((req,res) => {
  
  res.json({
    name: "bosancz-api",
    description: "API for bosan.cz",
    _links: RoutesLinks.root(req)
  });
  
});
