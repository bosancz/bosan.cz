 
// config injection token, i. e. the key in the injection storage map
import { InjectionToken } from '@angular/core';
export interface IAppConfig { [k:string]:any; }
export let AppConfig = new InjectionToken<IAppConfig>('app.config');



/* CONFIGURATION */
// configuration data
export const AppConfigData:IAppConfig = {

  acl: {
    
    // ngx-permissions
    permissions: [
      "account:view",
      "account:documents:view",

      "admin:view",
      "admin:camps:view",
      "admin:gallery:view",
      "admin:members:view",
      "admin:webconfig:view",
      "admin:users:view"
      
    ],
    roles: {
      "guest": [],
      "user": [],
      "admin": [],
      
      "clen": [],
      "vedouci": [],
      "hospodar": [],
      "revizor": [],
      "spravce": []
    },
    
    routes: [
      { route: "/interni/moje", allowRoles: ["user"] },
      { route: "/interni/moje/*", allowRoles: ["user"] },
      
      { route: "/interni/obsah", allowRoles: ["vedouci","spravce"] },
      { route: "/interni/obsah/*", allowRoles: ["vedouci","spravce"] }
    ],
    
    actions: {
      
    },
    
    default: {
      allowAll: false
    }
    
  }

};
