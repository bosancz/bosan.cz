global.routesStore = {
  routes: [],
};

import router from "./routes.router";

import mongoose from "./routes.mongoose";
import mongoosePlugin from "./routes.mongoose-plugin";

import resources from "./routes.resources";

export default { router, resources, mongoose, mongoosePlugin };
