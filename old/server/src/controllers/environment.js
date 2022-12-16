const { Routes } = require("@smallhillcz/routesjs");
const config = require("../config");

const routes = (module.exports = new Routes());

routes.get("environment", "/", {}).handle(async (req, res) => {
  res.json(config.environment);
});
