module.exports = (req,res,next) => {
  
  
  
  if(req.query.sort){
    let sortSet = req.query.sort.split(",");    
    
    let orderSet = sortSet.map(sort => sort.charAt(0) === "-" ? "desc" : "asc"); 
    sortSet = sortSet.map(sort => sort.charAt(0) === "-" ? sort.substr(1) : sort);
    
    delete req.query.sort;
    req.query._sort = sortSet.join(",");
    req.query._order = orderSet.join(",");    
  }
  
  req.query._limit = req.query.limit;
  delete req.query.limit;
  
  console.log(req.query)
  
  next();
};