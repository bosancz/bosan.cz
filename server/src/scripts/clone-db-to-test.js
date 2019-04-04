var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/bosan';

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  if (err) {
    return console.log(err);
  }

  client.db("bosan-test").dropDatabase(function(){

    const db = client.db("bosan");
    var mongoCommand = { copydb: 1, fromhost: "localhost", fromdb: "bosan", todb: "bosan-test" };
    var admin = db.admin();

    admin.command(mongoCommand, function(commandErr, data) {
      if (!commandErr) {
        console.log(data);
      } else {
        console.log(commandErr.errmsg);
      }
      client.close();
    });
    
  });

});