
const guest = true;
const user = true;

const clen = true;
const revizor = true;
const hospodar = true;
const vedouci = true;
const spravce = true;

module.exports = {
  
  "api:read": { guest },
  "webinfo:read": { guest },
  
  "albums:list": { spravce, vedouci, guest },
  "albums:drafts:list": { spravce, vedouci },
  
  "albums:recent:list": { spravce, vedouci, guest },
  "albums:read": { spravce, vedouci, guest },
  "albums:download": { spravce, vedouci, guest },
  "albums:create": { spravce, vedouci },
  "albums:edit": { spravce, vedouci },
  "albums:delete": { spravce, vedouci },
  
  "config:read": { spravce, guest },
  "config:edit": { spravce },

  "errors:list": { spravce },
  "errors:create": { spravce, guest },
  "errors:read": { spravce },
  "errors:delete": { spravce },
  
  "events:list": { spravce, clen },
  "events:read": { spravce, clen },  
  "events:create": { spravce, clen },
  "events:edit": { spravce, clen },
  "events:delete": { spravce, clen },
  "events:publish": { spravce, guest },
  
  "events:registration:read": { spravce, guest },
  "events:registration:edit": { spravce, vedouci },
  "events:registration:delete": { spravce, vedouci },

  "gallery:list": { spravce, guest },
  "gallery:read": { spravce, guest },
  
  "groups:list": { spravce, guest },
  "groups:read": { spravce, guest },

  "program:read": { spravce, guest },

  "login:credentials": { spravce, guest },
  "login:renew": { spravce, user },   
  "login:sendlink": { spravce, guest },
  "login:google": { spravce, guest },    
  "login:impersonate": { spravce }, 

  "me:read": { guest },
  
  "me:user:read": { spravce, user },
  "me:user:edit": { spravce, user },
  
  "me:group:read": { spravce, clen },
  "me:group:members:list": { spravce, clen },
  
  "members:list": { spravce, clen },
  "members:read": { spravce, clen },
  "members:create": { spravce, vedouci },
  "members:edit": { spravce, vedouci },
  "members:delete": { spravce, vedouci },
  
  "payments:list": { spravce, hospodar, revizor },
  "payments:read": { spravce, hospodar, revizor },
  "payments:create": { spravce, hospodar },
  "payments:edit": { spravce, hospodar },
  "payments:delete": { spravce, hospodar },
  
  "photos:list": { spravce, clen },
  "photos:read": { spravce, clen },
  "photos:create": { spravce, vedouci },
  "photos:edit": { spravce, vedouci },
  "photos:delete": { spravce, vedouci },
  
  "users:list": { spravce },
  "users:read": { spravce },
  "users:create": { spravce },
  "users:edit": { spravce },
  "users:delete": { spravce },

  "versions:read": { spravce, guest }
};