module.exports = function(){
  return function(req,res,next){

    const resources = {};

    restifyStore.resources.forEach(route => {
      if(!resources[route.resource]) resources[route.resource] = { _links: { } };

      resources[route.resource]._links[route.link] = {
        href: route.href
      };
    });

    res.json(resources);
  };
};