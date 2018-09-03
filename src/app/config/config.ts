
// config injection token, i. e. the key in the injection storage map
import { InjectionToken } from '@angular/core';
export interface IAppConfig { [k:string]:any; }
export let AppConfig = new InjectionToken<IAppConfig>('app.config');



/* CONFIGURATION */
// configuration data
export const AppConfigData: IAppConfig = {

  acl: {
    
    routes: [
      {
        route: "/interni/ucet/info",
        allowRoles: ["user","admin","spravce"]
      },
      {
        route: "/interni/*",
        allowRoles: ["admin","spravce"]
      }
    ],
    
    default: {
      allow: true
    }
    
  }

}