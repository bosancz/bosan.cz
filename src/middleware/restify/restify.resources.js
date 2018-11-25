module.exports = function(){
  return function(req,res,next){

    const resources = {};

    restifyRoutes.forEach(route => {
      if(!resources[route.resource]) resources[route.resource] = { _links: { } };

      resources[route.resource]._links[route.name] = {
        href: route.href
      };
    });

    res.json(resources);
  };
};