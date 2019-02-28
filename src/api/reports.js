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

  const report = { };
  
  report.events = events.reduce((acc,cur) => {
    
    if(cur.groups) cur.groups.forEach(group => {
      acc.groups[group] = acc.groups[group] ? acc.groups[group] + 1 : 1;
    });
    
    if(cur.dateTill && cur.dateFrom){
      const days = (cur.dateTill.setHours(0,0,0,0) - cur.dateFrom.setHours(0,0,0,0)) / 1000 / 60 / 60 / 24 + 1;
      acc.days += days;
      acc.mandays += days * ( (cur.leaders ? cur.leaders.length : 0) + (cur.attendees ? cur.attendees.length : 0) );
    }
    
    return acc;

  }, { groups: {}, days: 0, mandays: 0 });

  report.events.count = events.length;
  
  report.events.top = events
    .sort((a,b) => b.attendees.length - a.attendees.length)
    .slice(0,10)
    .filter(event => event.attendees.length > 0)
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

      acc.index[leader.member._id] = true;
    })
    return acc;
  },{ groups: {}, index: {}, top: [], age: JSON.parse(JSON.stringify(ages)) });

  report.leaders.top = Object.values(report.leaders.top).sort((a,b) => b.events.length - a.events.length).slice(0,10).filter(item => item.events.length > 0);
  report.leaders.count = Object.keys(report.leaders.index).length;
  delete report.leaders.index;


  report.attendees = events
    .map(event => {
    return event.attendees.map(member => ({
      member: member,
      age: member.birthday ? Math.min(26,Math.max(7,Math.floor((-1) * DateTime.fromJSDate(member.birthday).diffNow("years").years))) : undefined,
      group: member.group || undefined
    }));
  })
    .reduce((acc,cur) => {
    cur.forEach(attendee => {       
      if(attendee.age) acc.age[attendee.age]++;
      if(attendee.group) acc.groups[attendee.group] = acc.groups[attendee.group] ? acc.groups[attendee.group] + 1 : 1;
      acc.index[attendee.member._id] = true;
    })
    return acc;
  },{ groups: {}, index: {}, age: JSON.parse(JSON.stringify(ages)) });

  report.attendees.count = Object.keys(report.attendees.index).length;
  delete report.attendees.index;
  
  res.json(report);
});

routes.get("reports:members","/members", { permission: "reports:members:read" }).handle(async (req,res,next) => {
  
  const members = await Member.find({ inactive: { $ne: true } }).select("_id role birthday address.city").lean();  
  
  const report = {
    count: members.length,
    
    roles: members.reduce((acc,cur) => { acc[cur.role] = acc[cur.role] ? acc[cur.role] + 1 : 1; return acc; }, {}),
    
    ages: members
      .map(member => ({
        age: member.birthday ? String(Math.floor((-1) * DateTime.fromJSDate(member.birthday).diffNow("years").years)) : undefined,
        role: member.role
      }))
      .filter(member => member.age && member.role)
      .reduce((acc,member) => {
        if(!acc[member.role]) acc[member.role] = {};
        if(!acc[member.role][member.age]) acc[member.role][member.age] = 0;
        acc[member.role][member.age]++;
        return acc;
      }, {}),
    
    cities: members
      .map(member => member.address && member.address.city)     
      .filter(city => !!city)
      .reduce((acc,cur) => { acc[cur] = acc[cur] ? acc[cur] + 1 : 1; return acc; }, {}),
    
  };
  
  res.json(report);
  
});

