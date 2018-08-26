
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
        route: "/interni/*",
        allowRoles: ["admin","user"]
      }
      /*
      {
        route: "/:url/admin",
        allowRoles: ["admin"],
        //allowCheck: (user,params) => console.log(user,params)
        allowCheck: (user,params) => user.managedProfiles.indexOf(params.profile) !== -1
      }*/
    ],
    
    default: {
      allow: true
    }
    
  }

}