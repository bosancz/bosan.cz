global.restifyStore = {
  resources: []
}

const router = require("./restify.router");

const mongoose = require("./restify.mongoose");
const mongoosePlugin = require("./restify.mongoose-plugin");

const resources = require("./restify.resources");

module.exports = { router, resources, mongoose, mongoosePlugin };
