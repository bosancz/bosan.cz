module.exports = {
  can: {
    
    /* ALBUMS */
    //"albums:list": true,
    //"albums:read": true,
    "albums:create": true,
    "albums:edit": true,
    "albums:delete": true,

    /* CAMPS */
    //"camps:list": true,
    //"camps:read": true,
    "camps:create": true,
    "camps:edit": true,
    "camps:delete": true,
    
    /* WEB CONFIG */
    //"config:read": true,
    //"config:edit": true
    
    /* LOGIN */
    //"login": true,
    //"login:renew": true,

    /* EVENTS */
    //"events:list": true,
    //"events:read": true,
    "events:edit": true,
    "events:create": true,
    "events:delete": true,
    //"events:publish": true,
    //"events:upcoming:list": true,
    
    /* MEMBERS */
    //"members:list": true,
    "members:read": true,
    "members:create": true,
    "members:edit": true,
    "members:delete": true,

    /* PHOTOS */
    //"photos:list": true,
    //"photos:read": true,
    "photos:create": true,    
    "photos:edit": true,
    "photos:delete": true,
    
    /* USERS */
    "users:list": true,
    //"users:read": true,
    //"users:create": true,
    //"users:edit": true,
    //"users:delete": true,

    //"users:me:read": true,
    //"users:me:edit": true,
    //"users:me:delete": true,
    
  },
  inherits: ["clen"]
};