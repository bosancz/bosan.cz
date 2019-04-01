
const mongoParser = require("mongo-parse");

class MongooseActionsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MongooseActionsError';
  }
}

function checkActionsExist(actions,names){
  for(let name of names){
    if(!actions[name]) throw new MongooseActionsError("Invalid value for _actions: " + name);
  }
  return true;
}

// transform condition {_actions: ...} to database query
function filterInDB(query,actions){
  var findAction = query._conditions._actions;

  if(!findAction) return;

  if(Array.isArray(actions)) {
    checkActionsExist(actions,findAction);
    query.where({ $or: findAction.map(name => actions[name].query) });
  }
  else{
    checkActionsExist(actions,[findAction]);
    query.where(actions[findAction].query);
  }

  delete query._conditions._actions;
}

function createLink(doc,linkFn,root){
  const link = linkFn(doc);
  if(typeof link === "string") return link.replace(/^\/\//,root + "/");
  else return undefined;
}

module.exports = function(schema,options){

  const actions = options.actions || {};
  const links = options.links || {};
  const root = options.root || "";

  // prepare parsed query for matching retrieved documens
  Object.entries(actions).forEach(action => {
    if(action[1].query) action[1].queryParsed = mongoParser.parse(action[1].query);
  });

  // add virtuals to get available actions
  schema.virtual("_actions").get(function(){
    const docActions = {}
    Object.entries(actions)
      .filter(action => !action[1].queryParsed || action[1].queryParsed.matches(this,false))
      .forEach(action => docActions[action[0]] = { href: createLink(this,action[1].href,root) } );
    return docActions;
  });
  
  // add links to get available actions
  schema.virtual("_links").get(function(){
    const docLinks = {};
    Object.entries(links).forEach(link => docLinks[link[0]] = { href: createLink(this,link[1],root) } );
    return docLinks;
  });

  // add method action() for the Document objects
  schema.method("action",function(name,data){
    const action = actions[name];
    
    if(!action) throw new MongooseActionsError("Action " + name + " does not exist on this document.");
    if(!action.queryParsed.matches(this,false)) throw new MongooseActionsError("Action is not available on this document.");
    
    return action.action(this,data);
  });

  // add the hasAction(s) query helpers
  schema.query.hasActions = function(names){
    checkActionsExist(actions,names);
    return this.where(names.length > 1 ? { $or: names.map(name => actions[name].query) } : actions[names[0]].query);
  }

  schema.query.hasAction = function(name){
    return this.hasActions([name]);
  }


  schema.query.hasAnyAction = function(name){
    return this.where({ $or: Object.entries(actions).map(action => action[1].query) });
  }

  // hooks to find to enable in database filtering of events
  schema.pre("find",function(){ return filterInDB(this,actions); });
  schema.pre("findOne",function(){ return filterInDB(this,actions); });
  schema.pre("findOneAndUpdate",function(){ return filterInDB(this,actions); });

};
