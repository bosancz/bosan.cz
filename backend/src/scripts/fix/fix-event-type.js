var mongoose = require("mongoose");

var connection = require("../db");

var Event = require("../models/event");

var types = [{"id":"voda","title":"voda","image":""},{"id":"cyklo","title":"cyklo","image":""},{"id":"lyze","title":"lyže","image":""},{"id":"brigada","title":"brigáda","image":""},{"id":"tabor","title":"tábor","image":""},{"id":"putak","title":"puťák","image":""},{"id":"pesarna","title":"pěšárna","image":""},{"id":"bazen","title":"bazén","image":""},{"id":"po_praze","title":"po praze","image":""},{"id":"schuzka","title":"schůzka","image":""},{"id":"exkurze","title":"exkurze","image":""},{"id":"opravy","title":"opravy","image":""},{"id":"rukodelani","title":"rukodělání","image":""}];

var typeIndex = {};
types.forEach(type => typeIndex[type.id] = type.title);

Event.find().select("_id type")
  .then(events => Promise.all(events.map(event => {
    //event.srcType = event.type;
    event.type = typeIndex[event.type];
    return event.save();
  })))
  .then(() => console.log("Finished"))
  .then(() => process.exit());