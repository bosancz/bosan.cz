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

function get(model,idFn){
  return async function(req,res,next) {
    
    const query = model.findOne(idFn(req))
    
    if(req.query.select) query.select(req.query.select)
    
    return res.json(await query);
  }
}

module.exports = { list, get };