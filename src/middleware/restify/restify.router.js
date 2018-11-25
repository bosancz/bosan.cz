const mongoParser = require("mongo-parse");

class RestifyRouter {

  constructor(router,options){
    this.router = router;
    this.options = options;
  }

  parseResource(resourceString){
    var [resource,link] = resourceString.split(":");
    return {resource,link};
  }

  get(resource,def) {
    return this.addRoute({ method: "get", ...this.parseResource(resource), ...def });
  }

  post(resource,def) {
    return this.addRoute({ method: "post", ...this.parseResource(resource), ...def })
  }

  put(resource,def) {
    return this.addRoute({ method: "put", ...this.parseResource(resource), ...def })
  }

  patch(resource,def) {
    return this.addRoute({ method: "patch", ...this.parseResource(resource), ...def })
  }

  delete(resource,def) {
    return this.addRoute({ method: "delete", ...this.parseResource(resource), ...def })
  }

  addRoute(def){

    const path = def.path;
    const resourceName = def.resource;
    const href = this.options.root + path.replace(/\/\:([^\/]+)(\/|$)/,"\/{$1}$2");

    // save resource link
    restifyStore.resources.push({
      resource: def.resource,
      link: def.link,
      access: def.access,
      query: def.query,
      queryParsed: def.query ? mongoParser.parse(def.query) : undefined,
      href: href
    });

    // register route in the router
    const method = def.method.toLowerCase();

    const middleware = []
    if(def.middleware) middleware.push(...def.middleware);
    if(def.handler) middleware.push(def.handler);

    if(middleware.length) this.router[method](path, ...middleware);

  }
}
module.exports = function(router,options){
  return new RestifyRouter(router,options);
}