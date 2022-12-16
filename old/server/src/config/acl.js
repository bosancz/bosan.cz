const guest = true;
const user = true;

const clen = true,
  revizor = true,
  hospodar = true,
  vedouci = true,
  spravce = true,
  program = true;

const vedouciAkce = {
  vedouci: (req) =>
    !!req.user.member ? { $or: [{ "leaders._id": req.user.member }, { leaders: req.user.member }] } : false,
};

const permissions = {
  "api:read": { guest },
  "webinfo:read": { guest },

  "albums:list": { spravce, vedouci },
  "albums:drafts:list": { spravce, vedouci },
  "albums:recent:list": { spravce, vedouci },
  "albums:read": { spravce, vedouci },
  "albums:drafts:read": { spravce, vedouci },
  "albums:create": { spravce, vedouci },
  "albums:edit": { spravce, vedouci },
  "albums:publish": { spravce, vedouci },
  "albums:delete": { spravce, vedouci },

  "blogs:list": { guest },
  "blogs:drafts:list": { spravce, vedouci },
  "blogs:read": { spravce, vedouci },
  "blogs:create": { spravce, vedouci },
  "blogs:edit": { spravce, vedouci },
  "blogs:publish": { spravce, vedouci },
  "blogs:delete": { spravce, vedouci },

  "competition:read": { clen },

  "config:read": { spravce, guest },
  "config:edit": { spravce },

  "cpv:read": { clen },

  "errors:list": { spravce },
  "errors:create": { spravce, guest },
  "errors:read": { spravce },
  "errors:delete": { spravce },

  "events:list": { spravce, program, clen },
  "events:read": { spravce, program, clen },
  "events:create": { spravce, program },
  "events:edit": { spravce, program, ...vedouciAkce },
  "events:delete": { spravce, program },

  "events:lead": { spravce, vedouci },

  "events:submit": { spravce, ...vedouciAkce },
  "events:reject": { spravce, program },
  "events:publish": { spravce, program },
  "events:unpublish": { spravce, program },
  "events:cancel": { spravce, program },
  "events:finalize": { spravce, ...vedouciAkce },

  "events:payments:list": { spravce, revizor, hospodar },
  "events:noleader:list": { spravce, revizor, program, clen },

  "events:registration:read": { spravce, guest },
  "events:registration:edit": { spravce, ...vedouciAkce },
  "events:registration:delete": { spravce, ...vedouciAkce },

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
  "login:refresh": { refresh: true },
  "login:link": { spravce, guest },
  "login:google": { spravce, guest },
  "login:impersonate": { spravce },
  logout: { guest },

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

  "notifications:list": { user },
  "notifications:key:read": { user },

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

  "photos:readfile": { guest },

  "reports:events:read": { vedouci },
  "reports:members:read": { vedouci },

  "users:list": { spravce, revizor },
  "users:read": { spravce, revizor },
  "users:create": { spravce },
  "users:edit": { spravce },
  "users:delete": { spravce },

  "users:credentials:edit": { spravce, user: (req) => ({ _id: req.user._id }) },
  "users:subscriptions:edit": { user: (req) => ({ _id: req.user._id }) },

  "versions:read": { spravce, guest },
};

module.exports = {
  permissions,
  userRoles: (req) => (req.user ? req.user.roles || [] : []),
  authenticated: (req) => !!req.user,
  defaultRole: "guest",
  logConsole: true,
  logString: (event) =>
    `ACL ${event.result ? "OK" : "XX"} | permission: ${event.permission}, user: ${
      event.req.user ? event.req.user._id : "-"
    }, roles: ${event.req.user ? event.req.user.roles.join(",") : "-"}, ip: ${
      event.req.headers["x-forwarded-for"] || event.req.connection.remoteAddress
    }`,
};
