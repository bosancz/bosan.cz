const mongoParser = require("mongo-parse");

module.exports = function(schema,options){

  var defaultOptions = {
    cmpFn: (doc,resource) => doc.constructor.modelName.toLowerCase() === resource,
    expFn: (doc,href) => href.replace(/\{id}/,doc._id)
  }

  options = Object.assign({},defaultOptions,options);
  
  schema.virtual("_links").get(function(){

    const links = {};

    restifyStore.resources
      .filter(route => options.cmpFn(this,route.resource))
      .filter(route => !route.query || route.queryParsed.matches(this,false))
      .forEach(route => links[route.link] = ({ href: options.expFn(this,route.href) }))

    return links;
  });
}