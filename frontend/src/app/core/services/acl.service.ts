import { EventEmitter, Injectable } from '@angular/core';
import { permissions } from 'app/config/permissions';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { UserService } from './user.service';

export interface AclPermissions {
  [name: string]: {
    roles?: string[],
    validate?: (name: string, data?: any) => boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AclService {

  permissions = permissions;

  roles = this.userService.user
    .pipe(map(user => {
      if (user) return ["guest", "user", ...user.roles];
      else return ["guest"];
    }))
    .pipe(shareReplay(1));

  onUpdate: EventEmitter<void> = new EventEmitter();

  constructor(
    private userService: UserService
  ) { }

  can(canPermissions: string | string[], data?: any): Observable<boolean> {
    return this.roles.pipe(map(roles => this.checkCan(roles, this.permissions, canPermissions, data)));
  }

  private checkCan(userRoles: string[], permissions: AclPermissions, canPermissions: string | string[], data?: any): boolean {
    if (typeof canPermissions === "string" && canPermissions) canPermissions = [canPermissions];

    if (!canPermissions || !canPermissions.length) return true;

    for (let checkedPermission of canPermissions) {

      let permission = permissions[checkedPermission];

      if (!permission) throw new Error("Permission " + checkedPermission + " is not defined!");

      if (permission.roles && this.hasRole(userRoles, permission.roles)) return true;

      if (typeof permission.validate === "function") {
        let result = permission.validate(checkedPermission, data);
        if (result) return true;
      }
    }

    return false;
  }

  private hasRole(userRoles: string[], allowedRoles: string | string[]): boolean {

    // normalize input to array
    if (typeof allowedRoles === "string") allowedRoles = [allowedRoles];

    // check for an intersection of roles
    return allowedRoles.some(role => userRoles.indexOf(role) !== -1);
  }
}
