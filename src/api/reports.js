const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const { DateTime } = require("luxon");

var Event = require("../models/event");
var Member = require("../models/member");

routes.get("reports:events","/events/:year", { permission: "reports:events:read" }).handle(async (req,res,next) => {
  
  const query = Event.find({ status: "public" }, null, { autopopulate:false }).select("_id name dateFrom dateTill groups leaders attendees");
  query.populate("leaders","_id nickname birthday group");
  query.populate("attendees","birthday group");  
  
  query.where({
    dateFrom: {
      $gte: DateTime.local().set({ day: 1, month: 1, year: Number(req.params.year) }).toJSDate(),
      $lt: DateTime.local().set({ day: 1, month: 1, year: Number(req.params.year) + 1 }).toJSDate()
    }
  });
  
  const events = await query;
  
  const ages = { };
  for(let i = 7; i <= 26; i++) ages[String(i)] = 0;
  
  const report = {
    events: {
      count: events.length,
      groups: events.reduce((acc,cur) => {
        if(cur.groups) cur.groups.forEach(group => {
          acc[group] = acc[group] ? acc[group] + 1 : 1;
        });
        return acc;
      },{}),
      
    }
  };
  
  report.events.top = events
    .sort((a,b) => b.attendees.length - a.attendees.length)
    .slice(0,10)
    .map(event => ({ name: event.name, dateFrom: event.dateFrom, dateTill: event.dateTill, leaders: event.leaders.map(leader => ({ nickname: leader.nickname})), count: event.attendees.length }))
    
  report.leaders = events
    .map(event => {
      return event.leaders.map(member => ({
        member: member,
        event: event,
        age: member.birthday ? Math.min(26,Math.max(7,Math.floor((-1) * DateTime.fromJSDate(member.birthday).diffNow("years").years))) : undefined,
        group: member.group || undefined
      }));
    })
    .reduce((acc,cur) => {
      cur.forEach(leader => {
        if(leader.age) acc.age[leader.age]++;
        if(leader.group) acc.groups[leader.group] = acc.groups[leader.group] ? acc.groups[leader.group] + 1 : 1;
        
        if(!acc.top[leader.member._id]) acc.top[leader.member._id] = { member: { _id: leader.member._id, nickname: leader.member.nickname}, events: [] };        
        acc.top[leader.member._id].events.push({ _id: leader.event._id, name: leader.event.name })
        
        acc.count++;
      })
      return acc;
    },{ count: 0, groups: {}, top: [], age: JSON.parse(JSON.stringify(ages)) });
  
  report.leaders.top = Object.values(report.leaders.top).sort((a,b) => b.events.length - a.events.length).slice(0,10);
  
  report.attendees = events
    .map(event => {
      return event.attendees.map(member => ({
        age: member.birthday ? Math.min(26,Math.max(7,Math.floor((-1) * DateTime.fromJSDate(member.birthday).diffNow("years").years))) : undefined,
        group: member.group || undefined
      }));
    })
    .reduce((acc,cur) => {
      cur.forEach(member => {       
        if(member.age) acc.age[member.age]++;
        if(member.group) acc.groups[member.group] = acc.groups[member.group] ? acc.groups[member.group] + 1 : 1;
        acc.count++;
      })
      return acc;
    },{ count: 0, groups: {}, age: JSON.parse(JSON.stringify(ages)) });
  
  res.json(report);
});