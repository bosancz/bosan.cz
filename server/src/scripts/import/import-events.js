var mongoose = require("mongoose");
var mysql = require("mysql");

var Event = require("../models/event");
var Member = require("../models/member");

var connectionMongo = require("../db");

const dry = false;

var connectionSql = mysql.createConnection({
  host     : 'localhost',
  user     : 'bosancz',
  password : '',
  database : 'bosan-old'
});

function parseDate(dateString,timeString){
  let string = timeString ? dateString.toISOString().split("T")[0] + " " + String(timeString) : dateString;
  return new Date(string);
}

async function importEvents(){
  
  console.log("Importing events...");
  
  var leaders = await Member.find();
  
  var leadersIndex = {};
  leaders.forEach(leader => leadersIndex[leader.srcId] = leader);
  
  var groups = await new Promise((resolve,reject) => connectionSql.query('SELECT * FROM bo_akce_oddilu', (err,result,fields) => err ? reject(err) : resolve(result)));
  var events = await new Promise((resolve,reject) => connectionSql.query('SELECT PA.*,TA.typ FROM bo_program_akci AS PA LEFT JOIN bo_typ_akce AS TA ON TA.id_typ = PA.typ_akce_id', (err,result,fields) => err ? reject(err) : resolve(result)));
  
  var groupEventIndex = {}
  for(var group of groups){
    if(!groupEventIndex[group.id_akce]) groupEventIndex[group.id_akce] = [];
    groupEventIndex[group.id_akce].push(group.id_oddil === 99 ? "UH" : String(group.id_oddil));
  }
    
  for(var event of events){
    
    const existingEvent = await Event.findOne({ srcId: event.id_akce });
    
    if(existingEvent) continue;
    
    let eventData = {
      "srcId": event.id_akce,
      "name": event.nazev,
      "dateFrom": parseDate(event.datum_zacatek,event.cas_zacatek),
      "dateTill": parseDate(event.datum_konec,event.cas_konec),
      "dateChanged": parseDate(event.posledni_zmena),
      "description": event.popis,
      "type": event.typ,
      "groups": groupEventIndex[event.id_akce] || [],
      "leaders": [],
      "status": event.status === 0 ? "public" : "draft"
    };
    
    if(eventData.dateTill > new Date()) continue;
    
    
    if(!leadersIndex[event.vede_1_id] && event.vede_1_id > 0) console.log("Missing leader: " + event.vede_1_id);
    if(!leadersIndex[event.vede_2_id] && event.vede_2_id > 0) console.log("Missing leader: " + event.vede_2_id);
    
    if(event.vede_1_id && leadersIndex[event.vede_1_id]) eventData.leaders.push(leadersIndex[event.vede_1_id]._id);
    if(event.vede_2_id && leadersIndex[event.vede_2_id]) eventData.leaders.push(leadersIndex[event.vede_2_id]._id);
    
    console.log(" - " + eventData.name + "(" + eventData.dateFrom + ")" + eventData.leaders.join("+"));
    
    if(!dry) await Event.create(eventData);
    
  }
  
}

/* RUN */
Promise.resolve()
  .then(() => new Promise((resolve,reject) => connectionSql.connect(err => err ? reject(err) : resolve())))
  .then(() => importEvents())
  .then(() => new Promise((resolve,reject) => connectionSql.end(err => err ? reject(err) : resolve())))
  .then(() => process.exit());
  
