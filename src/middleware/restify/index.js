
global.restifyRoutes = [];

const restify = require("./restify");

restify.mongoose = require("./restify.mongoose");
restify.mongoosePlugin = require("./restify.mongoose-plugin");

restify.resources = require("./restify.resources");

module.exports = restify;