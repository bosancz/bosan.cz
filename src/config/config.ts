
// config injection token, i. e. the key in the injection storage map
import { InjectionToken } from '@angular/core';
export interface IAppConfig { [k:string]:any; }
export let AppConfig = new InjectionToken<IAppConfig>('app.config');



/* CONFIGURATION */
// configuration data
export const AppConfigData:IAppConfig = {

  acl: {
    
    routes: [
      { route: "/moje", allowRoles: ["user"] },
      { route: "/moje/*", allowRoles: ["user"] },
      
      { route: "/interni/akce", allowRoles: ["vedouci","spravce"] },
      { route: "/interni/akce/*", allowRoles: ["vedouci","spravce"] },
      
      { route: "/interni/tabory", allowRoles: ["vedouci","spravce"] },
      { route: "/interni/tabory/*", allowRoles: ["vedouci","spravce"] },
      
      { route: "/interni/galerie", allowRoles: ["vedouci","spravce"] },
      { route: "/interni/galerie/*", allowRoles: ["vedouci","spravce"] },
      
      { route: "/interni/clenove", allowRoles: ["vedouci","spravce"] },
      { route: "/interni/clenove/*", allowRoles: ["vedouci","spravce"] },
      
      { route: "/interni/galerie", allowRoles: ["vedouci","spravce"] },
      { route: "/interni/galerie/*", allowRoles: ["vedouci","spravce"] },
      
      { route: "/interni/dokumenty", allowRoles: ["vedouci","spravce"] },
      { route: "/interni/dokumenty/*", allowRoles: ["vedouci","spravce"] },
      
      { route: "/interni/nastaveni-webu", allowRoles: ["spravce"] },
      { route: "/interni/nastaveni-webu/*", allowRoles: ["spravce"] },
      
      { route: "/interni/nastaveni-serveru", allowRoles: ["spravce"] },
      { route: "/interni/nastaveni-serveru/*", allowRoles: ["spravce"] },
      
      { route: "/interni/uzivatele", allowRoles: ["spravce"] },
      { route: "/interni/uzivatele/*", allowRoles: ["spravce"] },
    ],
    
    actions: {
      
    },
    
    default: {
      allowAll: false
    }
    
  }

};
