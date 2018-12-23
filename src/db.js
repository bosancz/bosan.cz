var config = require("../config");

var mongoose = require('mongoose');

const mongooseAutopopulate = require("mongoose-autopopulate");
mongoose.plugin(mongooseAutopopulate);

mongoose.plugin(function(schema){
  schema.query.toObject = function(){
    
    return this.then(docs => {
      if(!docs) return docs;
      
      if(Array.isArray(docs)) return docs.map(doc => doc.toObject ? doc.toObject() : doc);
      else return docs.toObject ? docs.toObject() : docs;
    });
  }
});

mongoose.plugin(function(schema){
  schema.query.paginate = function(limit,skip){

    this.limit(limit);
    this.skip(skip || 0);

    return this.then(docs => {

      const count = this.model.find().where(this._conditions).count();

      return count.then(count => ({
        docs: docs.map(doc => doc.toObject ? doc.toObject() : doc),
        total: count,
        limit: limit,
        skip: skip || 0
      }));

    });

  }
});

const { RoutesPluginsMongoose } = require("@smallhillcz/routesjs/lib/plugins/mongoose");
mongoose.plugin(RoutesPluginsMongoose);

mongoose.Promise = global.Promise;

var connection = mongoose.connect(config.database.uri,config.database.options)
.then(() => console.log("Connected to " + config.database.uri))
.then(() => mongoose)
.catch(err => {
  throw new Error("Error when connectiong to " + config.database.uri + ": " + err.message); // if not connected the app will not throw any errors when accessing DB models, better to fail hard and fix
});

var models = require("./models"); // just load, so that we dont have to worry about missing schemas for references

module.exports = connection;