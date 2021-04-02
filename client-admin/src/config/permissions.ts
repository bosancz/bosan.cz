// ACL
export const permissions = {

  "login": { roles: ["spravce", "guest"] },
  "logout": { roles: ["spravce", "user"] },

  "admin": { roles: ["spravce", "vedouci"] },

  "admin:dashboard": { roles: ["spravce", "vedouci"] },
  "admin:events": { roles: ["spravce", "vedouci"] },
  "admin:albums": { roles: ["spravce", "vedouci"] },
  "admin:members": { roles: ["spravce", "vedouci"] },
  "admin:program": { roles: ["spravce", "vedouci"] },
  "admin:program-management": { roles: ["spravce", "program"] },
  "admin:statistics": { roles: ["spravce", "vedouci"] },
  "admin:canal": { roles: ["spravce", "vedouci"] },
  "admin:account": { roles: ["spravce", "user"] },
  "admin:users": { roles: ["spravce", "revizor"] },
  "admin:web-settings": { roles: ["spravce"] },
  
};
