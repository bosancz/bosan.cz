const webpush = require('web-push');

require("../db");

const User = require("../models/user");

const notificationTemplates = require("./notifications");

if (!process.env.KEYS_VAPID_PUBLIC || !process.env.KEYS_VAPID_PRIVATE) {
  console.log("[NOTIFICATIONS] Vapid keys not set. Notifications are disabled. Set KEYS_VAPID_PUBLIC and KEYS_VAPID_PRIVATE environment variables to enable.")
  module.exports = {
    sendNotifications: () => {},
    listNotifications
  };
  return;
}

webpush.setVapidDetails(
  'mailto:info@bosan.cz',
  process.env.KEYS_VAPID_PUBLIC,
  process.env.KEYS_VAPID_PRIVATE
);

function createNotification(name, data) {

  const payload = {
    "notification": {
      "title": "Notifikace z Bošánovského webu",
      "body": "",
      "icon": "https://bosan.cz/assets/img/logo.png",
      "vibrate": [100, 50, 100],
      "data": {},
      "actions": [
        /*{
          "action": "explore",
          "title": "Otevřít bosan.cz"
        }*/
      ]
    }
  };


  const notificationTemplate = notificationTemplates[name];
  if (!notificationTemplate) return payload;

  const notificationData = notificationTemplate(data) || {};

  Object.assign(payload.notification, notificationData);

  return payload;
}

async function sendNotifications(to, data) {

  const queue = [];

  const except = [];//to.except || [];

  if (to.all) {
    for (let notificationName of to.all) {

      if (!checkNotification(notificationName)) continue;

      const users = await User.find({ _id: { $nin: except }, notifications: notificationName, pushSubscriptions: { $exists: true } }).select("pushSubscriptions").lean();

      const subs = users.map(user => user.pushSubscriptions).reduce((acc, cur) => [...acc, ...cur], []);
      const payload = createNotification(notificationName, data);

      queue.push(sendNotification(subs, payload));
    }
  }

  if (to.users) {
    for (let entry of Object.entries(to.users)) {

      const notificationName = entry[0];
      if (!checkNotification(notificationName)) continue;

      const userIds = entry[1].filter(id => except.indexOf(id) === -1);

      const users = await User.find({ _id: { $in: userIds }, notifications: notificationName, pushSubscriptions: { $exists: true } }).select("pushSubscriptions").lean();

      const subs = users.map(user => user.pushSubscriptions).reduce((acc, cur) => [...acc, ...cur], []);
      const payload = createNotification(notificationName, data);

      queue.push(sendNotification(subs, payload));
    }
  }

  if (to.members) {
    for (let entry of Object.entries(to.members)) {
      const [notificationName, memberIds] = entry;

      if (!checkNotification(notificationName)) continue;

      const users = await User.find({ _id: { $nin: except }, member: { $in: memberIds }, notifications: notificationName, pushSubscriptions: { $exists: true } }).select("pushSubscriptions").lean();

      const subs = users.map(user => user.pushSubscriptions).reduce((acc, cur) => [...acc, ...cur], []);
      const payload = createNotification(notificationName, data);

      queue.push(sendNotification(subs, payload));
    }
  }

  try {
    await Promise.all(queue);
  }
  catch (err) {
    console.error(err);
  }

}


async function sendNotification(subs, payload) {

  const queue = subs.map(sub => webpush.sendNotification(sub, JSON.stringify(payload)));

  await Promise.all(queue);

}

function listNotifications() {
  return Object.keys(notificationTemplates);
}

function checkNotification(name) {
  return listNotifications().indexOf(name) !== -1
}

module.exports = { sendNotifications, listNotifications };