var guest = module.exports = {
  can: {
    
    "albums:list": true,
    "albums:read": true,
    
    "events:list": true,
    "events:upcoming:list": true,
    "events:read": true,
    
    "config:read": true,
    
    "login": true,
    
    "users:login:send": true // send login information to the email of the account
  }
};