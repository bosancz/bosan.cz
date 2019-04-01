const mongoParser = require("mongo-parse");

class RoutesRouter {

  constructor(router,options){
    this.router = router;
    this.options = options;
  }

  get(resource, path, options) {
    return this.createRoute("get", resource, path, options);
  }

  post(resource, path, options) {
    return this.createRoute("post", resource, path, options)
  }

  put(resource, path, options) {
    return this.createRoute("put", resource, path, options)
  }

  patch(resource, path, options) {
    return this.createRoute("patch", resource, path, options)
  }

  delete(resource, path, options) {
    return this.createRoute("delete", resource, path, options)
  }

  createRoute(method, resourceString, path, options = {}){
    
    const [resource,link] = resourceString.split(":");
    
    const href = this.options.root + path.replace(/\/\:([^\/]+)(\/|$)/,"\/{$1}$2");

    // save resource link
    const route =  new RoutesRoute(this.router, method, path, {
      resource: resource,
      link: link,
      href: href,
      mongoose: {
        query: options.query,
        queryParsed: options.query ? mongoParser.parse(options.query) : undefined
      }
    });
    
    routesStore.routes.push(route);
    
    return route;

  }
}

class RoutesRoute {
  
  constructor(router,method,path,options){
    this.router = router;
    this.method = method;
    this.path = path;
    this.options = options;
  }
  
  handle(handler){
    const method = this.method.toLowerCase();
    const path = this.path;
    const middleware = arguments;
    
    if(middleware.length) this.router[method](path, ...middleware);
  }
  
}

module.exports = function(router,options){
  return new RoutesRouter(router,options);
}