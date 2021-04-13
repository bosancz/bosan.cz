import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment, Router, UrlTree } from "@angular/router";
import { first, tap } from "rxjs/operators";

import { AclService } from "../services/acl.service";

@Injectable({
  providedIn: 'root'
})
export class AclGuard implements CanActivate, CanActivateChild, CanLoad {

  private loginUrlTree = this.router.createUrlTree(["/login"]);

  constructor(
    private aclService: AclService,
    private router: Router) {
  }

  async can(permission: string, data?: any) {
    return this.aclService.can(permission, data)
      .pipe(first())
      .toPromise().then(result => {
        console.log("ACL", permission, result);
        return result;
      });
  }

  canRoute(route: Route | ActivatedRouteSnapshot) {
    if (!route.data?.permission) return true;
    return this.can(route.data.permission, route.data);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.canRoute(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this.canRoute(route);
  }

  async canLoad(route: Route, segments: UrlSegment[]) {
    const can = await this.canRoute(route);
    return can || this.loginUrlTree;
  }
}