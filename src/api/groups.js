var express = require("express");
var router = module.exports = express.Router();

var acl = require("express-dynacl");

var restify = require("../middleware/restify");

var Group = require("../models/group");
var Member = require("../models/member");

const resources = {

  "groups": {
    path: "",
    routes: {
      "self": {
        path: "/",
        actions: {
          "GET": { middleware: [ acl("groups:list") ], handler: restify.mongoose.list(Group), available: {} }
        }
      }
    }
  },

  "group": {
    path: "/:id",
    routes: {
      "self": {
        path: "",
        actions: {
          "GET": { available: {}, middleware: [ acl("groups:list") ], handler: restify.mongoose.get(Group) }      
        }
      }
    }
  }
};

restify(router, resources, { root: "/api/groups" });
