const createEvent = require("./create-event");

module.exports = async function createRecurring(recurring,event){
  
  // list event files to copy
  var eventFiles = [];
  if(event.registration) eventFiles.push(path.join(config.events.eventDir(String(event._id)),event.registration));
  
  // normalize DB data
  var eventData = event.toObject();
  eventData.recurring = recurring._id;
  eventData.dateFrom.setUTCHours(0,0,0,0);
  eventData.dateTill.setUTCHours(0,0,0,0);
  delete eventData._id;
  delete eventData.id;
  delete eventData.__v;

  let startDate = recurring.startDate;
  let endDate = recurring.endDate;
  startDate.setUTCHours(0,0,0,0);
  endDate.setUTCHours(0,0,0,0);
  
  let date;
  
  switch(recurring.type){
    case "weekly":
      date = startDate;
      while(date.getDay() !== eventData.dateFrom.getDay()) date.setDate(date.getDate() + 1);
      
      // create the instances
      return createInstances(date,date => date.setDate(date.getDate() + 7),endDate,eventData,eventFiles); 

    case "monthly":
      date = new Date(startDate.getFullYear(), startDate.getMonth(), eventData.getDate());
      while(date < startDate) date.setMonth(date.getMonth() + 1);// move past the start date
      
      // create the instances
      return createInstances(date,date => date.setMonth(date.getMonth() + 1),endDate,eventData,eventFiles); 
      
    case "monthlyDay":
      let nth = Math.ceil(event.dateFrom.getDate() / 7);
      let day = event.dateFrom.getDay();
      
      date = new Date(startDate.getFullYear(),startDate.getMonth(),(nth - 1) * 7 + 1);
      while(date < startDate) date.setMonth(date.getMonth() + 1);// move past the start date
      date.setDate(date.getDate() + (day + 7 - date.getDay()) % 7); // move to the same weekday
      
      // create the instances
      return createInstances(date,date => {
        date.setMonth(date.getMonth() + 1)
        date.setDate((nth - 1) * 7 + 1);
        date.setDate(date.getDate() + (day + 7 - date.getDay()) % 7);
      },endDate,eventData,eventFiles); 

    case "yearly":
      date = new Date(startDate.getFullYear(),eventData.dateFrom.getMonth(),eventData.dateFrom.getDate());
      while(date < startDate) date.setFullYear(date.getFullYear() + 1);// move past the start date
      
      // create the instances
      return createInstances(date,date => date.setFullYear(date.getFullYear() + 1),endDate,eventData,eventFiles); 

  }
}

async function createInstances(date,nextDate,endDate,eventData,eventFiles){
  
  var instances = [];
  
  var length = eventData.dateTill.getTime() - eventData.dateFrom.getTime();
  
  var sourceEventTime = eventData.dateFrom.getTime();
  
  while(date <= endDate){
    
    // skip source event date
    if(date.getTime() === sourceEventTime){
      nextDate(date);
      continue;
    }
    
    eventData.dateFrom = date;
    eventData.dateTill = new Date(date.getTime() + length);
    
    let instance = await createEvent(eventData,eventFiles,{copyFiles:true});
    instances.push({_id: instance._id, date: new Date(date)});

    nextDate(date);
  } 
  
  return instances;

} 