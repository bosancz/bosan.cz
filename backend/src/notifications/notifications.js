const notifications = module.exports = {};

/*
"title": "Notifikace z Bošánovského webu",
"body": "Stalo se něco nového, něco nevídaného!",
"icon": "https://...",
"vibrate": [100, 50, 50, 50],
"data": { },
"actions": []
*/

notifications.eventPublished = notifications.myEventPublished = event => ({
  title: `Akce ${event.name} byla publikována.`,
  data: { type: "event", _id:event._id }
});

notifications.eventUnpublished = notifications.myEventUnpublished = event => ({
  title: `Akce ${event.name} byla odebrána z publikace.`,
  data: { type: "event", _id:event._id }
});