// ACL
export const permissions = {
  "login": { roles: ["spravce", "guest"] },
  "logout": { roles: ["spravce", "user"] },

  "admin": { roles: ["spravce", "clen"] },

  "admin:dashboard": { roles: ["spravce", "clen"] },
  "admin:events": { roles: ["spravce", "clen"] },
  "admin:albums": { roles: ["spravce", "clen"] },
  "admin:members": { roles: ["spravce", "vedouci"] },
  "admin:program": { roles: ["spravce", "program", "spravce"] },
  "admin:blogs": { roles: ["spravce", "vedouci"] },
  "admin:statistics": { roles: ["spravce", "vedouci"] },
  "admin:canal": { roles: ["spravce", "clen"] },
  "admin:account": { roles: ["spravce", "user"] },
  "admin:users": { roles: ["spravce", "revizor"] },
  "admin:web-settings": { roles: ["spravce"] },
};
