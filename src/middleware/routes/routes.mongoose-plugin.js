const mongoParser = require("mongo-parse");

module.exports = function(schema,options){

  var defaultOptions = {
    cmpFn: (doc,resource) => doc.constructor.modelName.toLowerCase() === resource,
    expFn: (doc,href) => href.replace(/\{id}/,doc._id)
  }

  options = Object.assign({},defaultOptions,options);
  
  schema.virtual("_links").get(function(){

    const links = {};

    routesStore.routes
      .filter(route => options.cmpFn(this,route.options.resource))
      .filter(route => !route.options.mongoose.queryParsed || route.options.mongoose.queryParsed.matches(this,false))
      .forEach(route => links[route.options.link] = ({ href: options.expFn(this,route.options.href) }))

    return links;
  });
}