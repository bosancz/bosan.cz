const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true}); // options can be passed, e.g. {allErrors: true}

function list(model,options){
  
  if(!model) throw new Error("Model can't be undefined.");
  
  options = Object.assign({},options);
  
  const validationSchema = {
    type: "object",
    properties: {
      "select": { type: "string" },
      "limit": { type: "number", maximum: options.limit }
    },
    additionalProperties: options.additionalProperties
  }
    
  // compile the validationschema
  const validateFn = ajv.compile(validationSchema);

  return async function(req,res,next) {

    const filter = typeof options.filter === "function" ? options.filter(req) : options.filter;
    
    if(!validateFn(req.query)) return res.status(400).json(validateFn.errors);

    const query = model.find(filter);

    if(req.query.search) query.where({ $or: options.search.map(searchField => ({ [searchField]: new RegExp(req.query.search,"i") })) } );
    if(req.query.select) query.select(req.query.select);
    if(req.query.populate) query.populate(req.query.populate);

    if(req.query.sort) query.sort(req.query.sort);
    
    if(req.query.limit) query.limit(req.query.limit);
    if(req.query.skip) query.skip(req.query.skip);

    const docs = await query;
    
    if(options.paginate){

      const count = await model.find(filter).count();

      res.json({
        docs: docs,
        total: count,
        limit: req.query.limit || 20,
        skip: req.query.skip || 0
      });
    }
    else {
      res.json(docs);
    }

  }

}

function get(model,options){
  
  options = Object.assign({},{id: "id"},options);
  
  return async function(req,res,next) {
    return res.json(await model.findOne({_id: req.params[options.id]}));
  }
}

function create(model,options){
  
  options = Object.assign({},{id: "id"},options);
  
  return async function(req,res,next) {
    const doc = await model.create(req.body,{new:true});
    res.header("location",doc._links.self)
    res.sendStatus(201);
  }
}

function update(model,options){
  
  options = Object.assign({},{id: "id"},options);
  
  return async function(req,res,next) {
    await model.findOneAndUpdate({_id: req.params[options.id]}, req.body);
    res.sendStatus(204);
  }
}

function replace(model,options){
  
  options = Object.assign({},{id: "id"},options);
  
  return async function(req,res,next) {
    await model.replaceOne({_id: req.params[options.id]},req.body);
    res.sendStatus(204);
  }
}

function remove(){
  
  options = Object.assign({},{id: "id"},options);
  
  return async function(req,res,next) {
    await model.remove({_id: req.params[options.id]});
    res.sendStatus(204);
  }
}

function action(model,action,options) {
  return async function(req,res,next) {
    const doc = await model.findOne({_id: req.params[options.id]});
    
  }
}

module.exports = { list, get, create, update, replace, remove, action };