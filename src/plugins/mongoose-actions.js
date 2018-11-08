
const mongoParser = require("mongo-parse");

function checkActionsExist(actions,names){
  for(let name of names){
    if(!actions[name]){
      const e = new Error("Invalid value for _actions: " + name);
      e.name = "MongooseActionsError";
      throw e;
    }   
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

module.exports = function(schema,options){

  const actions = options.actions;

  // prepare parsed query for matching retrieved documens
  Object.entries(actions).forEach(action => {
    if(action[1].query) action[1].queryParsed = mongoParser.parse(action[1].query);
  });

  // add virtuals to get available actions
  schema.virtual("_actions").get(function(){
    return Object.keys(actions).filter(action => !actions[action].queryParsed || actions[action].queryParsed.matches(this,false));
  });

  // add method action() for the Document objects
  schema.method("action",function(name,data){
    actions[name].action(this,data);
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
