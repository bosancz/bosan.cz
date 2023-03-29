import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment, Router, UrlTree } from "@angular/router";
import { first, tap } from "rxjs/operators";

import { AclService } from "../services/acl.service";

@Injectable({
  providedIn: 'root'
})
export class AclGuard implements CanActivate, CanActivateChild, CanLoad {

  private accountUrlTree = this.router.createUrlTree(["/ucet"]);

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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canRoute(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canRoute(route);
  }

  async canLoad(route: Route, segments: UrlSegment[]) {
    const can = await this.canRoute(route);

    const return_url = window.location.pathname;

    // if possible load 
    return can
      || (await this.can("dashboard") && this.router.createUrlTree(["/prehled"]))
      || (await this.can("account") && this.router.createUrlTree(["/ucet"]))
      || this.router.createUrlTree(["/login"], { queryParams: { return_url } });
  }
}