module.exports = function(schema,options){
  
  schema.query.req = function (req) {
    
    var query = this;
    
    if(!req.query) {

      if(req.query.select) query.select(req.query.select.split(",").join(" "));

      if(req.query.where) query.where(req.query.where);

      if(req.query.limit) query.limit(Number(req.query.limit) || 0);

      if(req.query.sort) query.sort(req.query.sort);    

    }
    
    return query;
  };
  
  schema.query.res = function (res,next) {
    
    this
      .then(data => res.json(data))
      .catch(err => next(err));
  }
  
  schema.query.middleware = function (){
    
    var query = this;
    
    return function(req,res,next){
      schema.query.req.apply(query,[req]);
      schema.query.res.apply(query,[res,next]);
    }
  }
    
}
