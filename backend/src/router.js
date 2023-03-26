const config = require("./config");

const { Routes, RoutesLinks } = require("@smallhillcz/routesjs");

const routes = new Routes({ url: "" });

module.exports = routes.router;

routes.child("/albums", require("./controllers/albums"));

routes.child("/blogs", require("./controllers/blogs"));

routes.child("/config", require("./controllers/config"));

routes.child("/competition", require("./controllers/competition"));

routes.child("/cpv", require("./controllers/cpv"));

routes.child("/environment", require("./controllers/environment"));

routes.child("/errors", require("./controllers/errors"));

routes.child("/events", require("./controllers/events"));
routes.child("/events/:id", require("./controllers/events-event"));

routes.child("/gallery", require("./controllers/gallery"));

routes.child("/groups", require("./controllers/groups"));

routes.child("/login", require("./controllers/login"));

routes.child("/me", require("./controllers/me"));

routes.child("/members", require("./controllers/members"));

routes.child("/notifications", require("./controllers/notifications"));

routes.child("/payments", require("./controllers/payments"));

routes.child("/photos", require("./controllers/photos"));

routes.child("/program", require("./controllers/program"));

routes.child("/reports", require("./controllers/reports"));

routes.child("/share", require("./controllers/share"));

routes.child("/users", require("./controllers/users"));

routes.child("/test", require("./controllers/test"));

routes.get(null, "/", { permission: "api:read" }).handle((req, res) => {
  res.json({
    name: "bosancz-api",
    description: "API for bosan.cz",
    _links: RoutesLinks.root(req),
  });
});
