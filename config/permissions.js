
const guest = true;
const user = true;

const clen = true, revizor = true, hospodar = true, vedouci = true, spravce = true, program = true;

const vedouciAkce = { vedouci: req => ({ leaders: req.user._id}) };

module.exports = {
  
  "api:read": { guest },
  "webinfo:read": { guest },
  
  "albums:list": { spravce, vedouci },
  "albums:drafts:list": { spravce, vedouci },
  
  "albums:recent:list": { spravce, vedouci },
  "albums:read": { spravce, vedouci },
  "albums:create": { spravce, vedouci },
  "albums:edit": { spravce, vedouci },
  "albums:delete": { spravce, vedouci },
  
  "config:read": { spravce, guest },
  "config:edit": { spravce },
  
  "cpv:read": { clen },

  "errors:list": { spravce },
  "errors:create": { spravce, guest },
  "errors:read": { spravce },
  "errors:delete": { spravce },
  
  "events:list": { spravce, program, clen, guest: { status: "public" } },
  "events:read": { spravce, program, clen, guest: { status: "public" } },  
  "events:create": { spravce, program },
  "events:edit": { spravce, program, ...vedouciAkce },
  "events:delete": { spravce, program },
  
  "events:publish": { spravce, program },
  "events:lead": { spravce, vedouci },
  "events:cancel": { spravce, program },
  
  "events:payments:list": { spravce, revizor, hospodar },
  "events:noleader:list": { spravce, revizor, program, clen },
  
  "events:registration:read": { spravce, guest },
  "events:registration:edit": { spravce, vedouci },
  "events:registration:delete": { spravce, vedouci },  
  
  "events:accounting:read": { spravce, revizor, hospodar, ...vedouciAkce },
  "events:accounting:edit": { spravce, revizor, hospodar, ...vedouciAkce },
  "events:accounting:delete": { spravce, revizor, hospodar, ...vedouciAkce },

  "gallery:list": { spravce, guest },
  "gallery:read": { spravce, guest },
  "gallery:download": { spravce, guest },
  
  "groups:list": { spravce, guest },
  "groups:read": { spravce, guest },

  "program:read": { spravce, guest },
  "program:stats": { spravce, program },

  "login:credentials": { spravce, guest },
  "login:renew": { spravce, user },   
  "login:sendlink": { spravce, guest },
  "login:google": { spravce, guest },    

  "me:read": { guest },
  
  "me:user:read": { spravce, user },
  
  "me:group:read": { spravce, clen },
  "me:group:members:list": { spravce, clen },
  
  "me:events:list": { spravce, clen },
  
  "me:dashboard:read": { user },
  
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
  "users:impersonate": { spravce }, 
  
  "users:credentials:edit": { spravce, user: req => ({ _id: req.user._id }) },

  "versions:read": { spravce, guest }
};