// ACL
export const permissions = {
  "login": { roles: ["guest"] },
  "logout": { roles: ["user"] },
  
  "admin": { roles: ["spravce","vedouci","revizor"] },
  "admin:events": { roles: ["spravce","revizor","vedouci"] },
  "admin:camps": { roles: ["spravce","revizor","vedouci"] },
  "admin:gallery": { roles: ["spravce","revizor","vedouci"] },
  "admin:members": { roles: ["spravce","revizor","vedouci"] },
  "admin:payments": { roles: ["spravce","hospodar","revizor","spravce"] },
  "admin:users": { roles: ["spravce","revizor"] },
  "admin:webconfig": { roles: ["spravce","revizor"] },
  "admin:serverconfig": { roles: ["spravce","revizor"] },
  "admin:errors": { roles: ["spravce","revizor"] },
  
  "my:dashboard": { roles: ["clen"] },
  "my:events": { roles: ["vedouci"] },
  "my:group": { roles: ["spravce"] },
  "my:program": { roles: ["program","spravce"] },
  "my:competition": { roles: ["clen"] },
  "my:statistics": { roles: ["vedouci"] },
  "my:canal": { roles: ["clen"] },
  "my:account": { roles: ["user"] }
};
