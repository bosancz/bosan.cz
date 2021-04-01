// ACL
export const permissions = {
  "login": { roles: ["guest"] },
  "logout": { roles: ["user"] },

  "admin": { roles: ["spravce", "clen"] },

  "admin:dashboard": { roles: ["clen"] },
  "admin:events": { roles: ["clen"] },
  "admin:albums": { roles: ["clen"] },
  "admin:members": { roles: ["vedouci"] },
  "admin:program-management": { roles: ["program", "spravce"] },
  "admin:statistics": { roles: ["vedouci"] },
  "admin:canal": { roles: ["clen"] },
  "admin:account": { roles: ["user"] },
  "admin:users": { roles: ["spravce", "revizor"] },
  "admin:web-settings": { roles: ["spravce"] },
};
