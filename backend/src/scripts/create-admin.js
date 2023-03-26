var bcrypt = require("bcryptjs");

var config = require("../config");

var { mongoose, connectDB } = require("../db");

var User = require("../models/user");

(async function () {
  try {

    console.log("Connecting to DB...");
    await connectDB();

    console.log("Creating hash...");
    const hash = await bcrypt.hash("admin", config.auth.bcrypt.rounds);

    console.log("Deleting any previous admin user...");
    await User.deleteMany({ login: "admin" });

    console.log("Saving user...");
    await User.create({ login: "admin", password: hash, roles: ["spravce"] });

    console.log(`Created user "admin" with password "admin".`);
    
  }
  catch (err) {
    console.error("Error when creating user:");
    console.error(err);
  }

  mongoose.disconnect();

})();