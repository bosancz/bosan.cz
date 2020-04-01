import { Injectable, ApplicationRef, EventEmitter } from '@angular/core';
import { ReplaySubject, Observable, combineLatest } from 'rxjs';
import { first, map } from 'rxjs/operators';

export interface AclPermissions {
  [name: string]: {
    roles?: string[],
    validate?: (name: string, data?: any) => boolean
  };
}

@Injectable({
  providedIn: 'root'
})
export class AclService {

  permissions: ReplaySubject<AclPermissions> = new ReplaySubject(1);

  roles: ReplaySubject<string[]> = new ReplaySubject(1);

  onUpdate: EventEmitter<void> = new EventEmitter();

  constructor(private appRef: ApplicationRef) { }

  can(canPermissions: string | string[], data?: any): Observable<boolean> {
    return combineLatest(this.roles, this.permissions).pipe(map(([roles, permissions]) => this.checkCan(roles, permissions, canPermissions, data)));
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

  setPermissions(permissions: AclPermissions): void {
    this.permissions.next(permissions);
    this.onUpdate.emit();
  }

  setRoles(roles: string[]): void {
    this.roles.next(roles);
    this.onUpdate.emit();
  }
}
