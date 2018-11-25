function restify(router,resources,options){

  const defaultOptions = {
    root: ""
  };
  
  options = Object.assign({},defaultOptions,options);
  
  Object.entries(resources).forEach(resourceEntry => {

    const [resourceName,resource] = resourceEntry;

    Object.entries(resource.routes).forEach(routeEntry => {

      const [routeLink,route] = routeEntry;
      
      const href = resource.path + route.path;

      Object.entries(route.actions).forEach(actionEntry => {

        const [method,action] = actionEntry;

        const middleware = [...action.middleware,action.handler];

        restifyRoutes.push({
          name: routeLink,
          resource: resourceName,
          href: options.root + href.replace(/\/\:([^\/]+)(\/|$)/,"\/{$1}$2")
        });
        
        console.log(method,href);
        
        // register route in the router
        if(middleware.length) router[method.toLowerCase()](href, ...middleware);
      });
    });
  });
  
}

module.exports = restify;