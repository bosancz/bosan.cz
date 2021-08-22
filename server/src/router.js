import { Routes, RoutesLinks } from "@smallhillcz/routesjs";
import { AlbumsController } from "./controllers/albums.js";
import { BlogsController } from "./controllers/blogs.js";
import { CompetitionController } from "./controllers/competition.js";
import { ConfigController } from "./controllers/config.js";
import { CpvController } from "./controllers/cpv.js";
import { EnvironmentController } from "./controllers/environment.js";
import { ErrorsController } from "./controllers/errors.js";
import { EventsEventController } from "./controllers/events-event.js";
import { EventsController } from "./controllers/events.js";
import { GalleryController } from "./controllers/gallery.js";
import { GroupsController } from "./controllers/groups.js";
import { LoginController } from "./controllers/login.js";
import { MeController } from "./controllers/me.js";
import { MembersController } from "./controllers/members.js";
import { NotificationsController } from "./controllers/notifications.js";
import { PaymentsController } from "./controllers/payments.js";
import { PhotosController } from "./controllers/photos.js";
import { ProgramController } from "./controllers/program.js";
import { ReportsController } from "./controllers/reports.js";
import { ShareController } from "./controllers/share.js";
import { TestController } from "./controllers/test.js";
import { UsersController } from "./controllers/users.js";

const routes = new Routes({ url: "" });

export default routes.router;

routes.child("/albums", AlbumsController);

routes.child("/blogs", BlogsController);

routes.child("/config", ConfigController);

routes.child("/competition", CompetitionController);

routes.child("/cpv", CpvController);

routes.child("/environment", EnvironmentController);

routes.child("/errors", ErrorsController);

routes.child("/events", EventsController);

routes.child("/events/:id", EventsEventController);

routes.child("/gallery", GalleryController);

routes.child("/groups", GroupsController);

routes.child("/login", LoginController);

routes.child("/me", MeController);

routes.child("/members", MembersController);

routes.child("/notifications", NotificationsController);

routes.child("/payments", PaymentsController);

routes.child("/photos", PhotosController);

routes.child("/program", ProgramController);

routes.child("/reports", ReportsController);

routes.child("/share", ShareController);

routes.child("/users", UsersController);

routes.child("/test", TestController);

routes.get(null, "/", { permission: "api:read" }).handle((req, res) => {
  res.json({
    name: "bosancz-api",
    description: "API for bosan.cz",
    _links: RoutesLinks.root(req),
  });
});
