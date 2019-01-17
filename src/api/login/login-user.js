var createToken = require("./create-token");
var saveCookie = require("./save-cookie");

module.exports = async function(res,user){
  var token = await createToken(user);
  
  saveCookie(res,token);
  
  return {access_token: token};
}