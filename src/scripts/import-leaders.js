var mongoose = require("mongoose");
var mysql = require("mysql");

var moment = require('moment-timezone');

var Member = require("../models/member");

var connectionMongo = require("../db");

var connectionSql = mysql.createConnection({
  host     : 'localhost',
  user     : 'bosancz',
  password : '',
  database : 'bosan-old'
});


function parseGroup(group){
  if(group === 100) return "KV";
  if(group === 99) return "UH";
  return String(group);
}

async function importEvents(){
  
  console.log("Importing leaders...");
  
  var leaders = await new Promise((resolve,reject) => connectionSql.query('SELECT * FROM bo_vedouci', (err,result,fields) => err ? reject(err) : resolve(result)));
  
  for(var leader of leaders){

    let memberData = {
      "srcId": leader.id_vedouci,
      "nickname": leader.prezdivka,
      "contacts": {
        "mobile": "+420 " + leader.mobil,
        "email": leader.email
      },
      "group": parseGroup(leader.oddil_id)
    };
    
    console.log(memberData);

    await Member.create(memberData);
  }
  
}

/* RUN */
Promise.resolve()
  .then(() => new Promise((resolve,reject) => connectionSql.connect(err => err ? reject(err) : resolve())))
  .then(() => importEvents())
  .then(() => new Promise((resolve,reject) => connectionSql.end(err => err ? reject(err) : resolve())))
  .then(() => process.exit());
  
