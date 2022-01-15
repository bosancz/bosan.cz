// ACL
export const permissions = {

  "login": { roles: ["spravce", "guest"] },
  "logout": { roles: ["spravce", "user"] },

  "dashboard": { roles: ["spravce", "vedouci"] },
  "events": { roles: ["spravce", "vedouci"] },
  "albums": { roles: ["spravce", "vedouci"] },
  "blogs": { roles: ["spravce", "vedouci"] },
  "members": { roles: ["spravce", "vedouci"] },
  "program": { roles: ["spravce", "vedouci"] },
  "program-management": { roles: ["spravce", "program"] },
  "statistics": { roles: ["spravce", "vedouci"] },
  "canal": { roles: ["spravce", "vedouci"] },
  "account": { roles: ["user"] },
  "users": { roles: ["spravce", "revizor"] },
  "web": { roles: ["spravce"] },

};