const path = require("path");

const storage = require("./storage");

module.exports = {  
  eventDir: (eventId) => path.resolve(storage.events, String(eventId)),

  accounting: {
    xlsx: path.resolve(__dirname, "../../assets/uctovani-v6.xlsx")
  },

  announcement: {
    xlsx: path.resolve(__dirname, "../../assets/ohlaska_pan_hlavni.xlsx")
  }
}