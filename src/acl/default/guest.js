var guest = module.exports = {
  can: {
    
    "albums:list": true,
    "albums:read": true,
    "albums:download": true,
    "albums:recent:list": true,
    
    "events:list": false,
    "events:program:read": true,
    "events:read": true,
    
    "groups:list": true,
    "groups:read": true,
    
    "errors:create": true,
    
    "config:read": true,
    
    "login:credentials": true,
    "login:sendlink":true,
    "login:google":true,    

    "versions:read": true
  }
};