// ACL
export const permissions = {
  "login": { roles: ["guest"] },
  "logout": { roles: ["user"] },
  
  "admin": { roles: ["vedouci"] },
  "admin:events": { roles: ["vedouci"] },
  "admin:camps": { roles: ["vedouci"] },
  "admin:gallery": { roles: ["vedouci"] },
  "admin:members": { roles: ["vedouci"] },
  "admin:payments": { roles: ["hospodar","revizor","spravce"] },
  "admin:users": { roles: ["spravce"] },
  "admin:webconfig": { roles: ["spravce"] },
  "admin:serverconfig": { roles: ["spravce"] },
  "admin:errors": { roles: ["spravce"] },
  
  "my:dashboard": { roles: ["clen"] },
  "my:events": { roles: ["vedouci"] },
  "my:group": { roles: ["spravce"] },
  "my:program": { roles: ["program","spravce"] },
  "my:auditor": { roles: ["revizor","spravce"] },
  "my:canal": { roles: ["clen"] },
  "my:account": { roles: ["user"] }
};
