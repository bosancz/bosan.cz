import { Routes } from "@smallhillcz/routesjs";
import MeDashboardController from "./me-dashboard";
import MeEventsController from "./me-events";
import MeGroupController from "./me-group";
import MeUserController from "./me-user";
const routes = (module.exports = new Routes());

routes.child("/user", MeUserController);
routes.child("/group", MeGroupController);
routes.child("/events", MeEventsController);
routes.child("/dashboard", MeDashboardController);

routes.get("me", "/", { permission: "me:read" }).handle(async (req, res, next) => {
  if (req.user) {
    const userData = {
      _id: req.user._id,
      roles: req.user._id,
      member: req.user.member,
      group: req.user.group,
    };
    return res.json(userData);
  } else
    res.json({
      roles: ["guest"],
    });
});
