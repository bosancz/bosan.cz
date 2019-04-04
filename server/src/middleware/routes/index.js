global.routesStore = {
  routes: []
}

const router = require("./routes.router");

const mongoose = require("./routes.mongoose");
const mongoosePlugin = require("./routes.mongoose-plugin");

const resources = require("./routes.resources");

module.exports = { router, resources, mongoose, mongoosePlugin };
