var mongoose = require("mongoose");

var connection = require("../db");

var Event = require("../models/event");

Event.find().select("_id type srcType")
  .then(events => Promise.all(events.map(event => {
    //event.srcType = event.type;
    if(!event.srcType){
      event.type = "akce";
      return event.save();
    }
  })))
  .then(() => console.log("Finished"))
  .then(() => process.exit());