var isPlainObject = require('is-plain-object');

var replacements = {
  "null": null,
  "false": false,
  "true": true
};

function convertTypes(value){  
  
  if(Array.isArray(value)) return value.map(item => convertTypes(item));
  
  if(isPlainObject(value)){
    Object.keys(value).forEach(key => value[key] = convertTypes(value[key]));
    return value;
  }

  if(replacements[value] !== undefined) return replacements[value];
  
  if(value === "") return undefined;
  
  if(!isNaN(Number(value))) return Number(value);

  return value;
}

module.exports = function(req,res,next){
  if(req.query) req.query = convertTypes(req.query);
  next();
}