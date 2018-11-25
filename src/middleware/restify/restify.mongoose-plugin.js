module.exports = function(schema,options){
  
  var defaultOptions = {
    cmpFn: (doc,resource) => doc.constructor.modelName.toLowerCase() === resource,
    expFn: (doc,href) => href.replace(/\{id}/,doc._id)
  }

  options = Object.assign({},defaultOptions,options);
  
  schema.virtual("_links").get(function(){
    
    const links = {};
    
    restifyRoutes.filter(route => options.cmpFn(this,route.resource)).forEach(route => {
      links[route.name] = { href: options.expFn(this,route.href) }
    });
    
    return links;
  });
}