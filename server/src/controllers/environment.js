import { Routes } from "@smallhillcz/routesjs";
import * as config from "../config/index.js";

const routes = (module.exports = new Routes());

routes.get("environment", "/", {}).handle(async (req, res) => {
  res.json(config.environment);
});
