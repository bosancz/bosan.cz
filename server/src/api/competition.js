const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const { DateTime } = require("luxon");

const { Event, Member } = require("../models");

routes.get("competition:years","/years", {permission:"competition:read"}).handle(async (req,res,next) => {
  const years = await Event.aggregate([
    { $match: { "competition.water_km": { $gt: 0 } } },
    { $project: { year: { $year: "$dateFrom" } } },
    { $group: { _id: null, years: { $addToSet: "$year" } } }
  ])
  res.json(years[0].years);
});

routes.get("competition:ranking","/ranking", { permission: "competition:read" }).handle(async (req,res) => {

  const year = req.query.year || Number(DateTime.local().year);

  const dateFrom = DateTime.local().set({year: year - 1, month: 12, day: 1}).toJSDate();
  const dateTill = DateTime.local().set({year: year, month: 12, day: 1}).toJSDate();

  const events = await Event
  .find({ "competition.water_km": { $gt: 0 }, dateFrom: { $lt: dateTill }, dateTill: { $gte: dateFrom } })
  .select("_id name dateFrom dateTill leaders attendees competition")
  .lean();

  const attendeeIndex = {};

  for(let event of events){

    const water_km = Number(event.competition.water_km);

    if(!event.attendees || !water_km) continue;

    const attendees = [...event.attendees,...event.leaders];

    for(let attendee of attendees){
      if(!attendeeIndex[attendee]) attendeeIndex[attendee] = { member: attendee, water_km: 0, events: [] };
      attendeeIndex[attendee].water_km += water_km;
      attendeeIndex[attendee].events.push({
        _id: event._id,
        name: event.name,
        dateFrom: event.dateFrom,
        dateTill: event.dateTill,
        competition: event.competition
      });
    }
  }

  const members = await Member.find({_id: { $in: Object.keys(attendeeIndex) } }).select("_id nickname name group").lean();
  for( let member of members ) attendeeIndex[member._id].member = member;  

  const ranking = Object.values(attendeeIndex);

  ranking.sort((a,b) => b.water_km - a.water_km);

  let ranked = [];
  
  for(let i = 0; i < ranking.length; i++){

    ranked.push(ranking[i]);

    if(!ranking[i + 1] || ranking[i + 1].water_km !== ranking[i].water_km){
      ranked.forEach(rankedItem => {
        rankedItem.rank = (i + 1) - (ranked.length - 1);
        rankedItem.rankTo = (i + 1);
      })
      ranked = [];
    }

  }


  res.json(ranking);
});