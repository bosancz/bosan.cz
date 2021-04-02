import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from "@angular/router";

import { AclService } from "./acl.service";

@Injectable({
  providedIn: 'root'
})
export class AclGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private aclService: AclService) {
  }

  can(permission: string, data?: any) {
    return this.aclService.can(permission, data).toPromise().then(result => {
      console.log("ACL", permission, result);
      return result;
    });
  }

  canRoute(route: Route | ActivatedRouteSnapshot) {
    if (!route.data || !route.data.permission) return true;
    return this.can(route.data.permission, route.data);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.canRoute(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.canRoute(route);
  }

  canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> | boolean {
    return this.canRoute(route);
  }
}