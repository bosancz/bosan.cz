const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const { DateTime } = require("luxon");

var Event = require("../models/event");
var Member = require("../models/member");

routes.get("reports:leaders","/leaders/:year", { permission: "reports:events:read" }).handle(async (req,res,next) => {
  
  const query = Event.find({}, null, { autopopulate:false }).select("_id name groups leadersEvent leaders attendees");
  query.populate("leaders","birthday group");
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
      },{})
    }
  };
  
  report.leaders = events
    .map(event => {
      return event.leaders.map(member => ({
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