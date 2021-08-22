import { Routes } from "@smallhillcz/routesjs";
const routes = (module.exports = new Routes());

import mongoose from "mongoose";

routes.router.get("/", (req, res, next) => {
  const status = {
    db: !!mongoose.connection.readyState,
  };

  const ok = Object.entries(status).reduce((acc, cur) => acc && cur[1], true);

  res.status(ok ? 200 : 500).json(status);
});
