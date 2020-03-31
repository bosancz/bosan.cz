import mongoose from "mongoose";

/* SETTINGS */
mongoose.Promise = global.Promise;

/* CONNECTION */
var retries = 0;

export async function connect(databaseUri: string): Promise<void> {

  console.log("[DB] Connecting to DB...");

  try {
    await mongoose.connect(databaseUri, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("[DB] Connected to " + databaseUri);
  }
  catch (err) {
    console.error("[DB] Error when connectiong to " + databaseUri + ": " + err.message); // if not connected the app will not throw any errors when accessing DB models, better to fail hard and fix

    retries++;

    if (retries <= 10) {
      console.error("[DB] Retrying in 10s...");
      return new Promise((resolve, reject) => setTimeout(() => resolve(connect(databaseUri)), 10000));
    }
    else {
      throw new Error("DB connection failed.");
    }
  }
}

export function disconnect() {
  return mongoose.disconnect()
}