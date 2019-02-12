import { Injectable, ApplicationRef, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';

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

  permissions: AclPermissions = {};

  roles: ReplaySubject<string[]> = new ReplaySubject(1);

  onUpdate: EventEmitter<void> = new EventEmitter();

  constructor(private appRef: ApplicationRef) { }

  can(permissions: string | string[], data?: any): Promise<boolean> {
    return this.checkCan(permissions, data);
  }

  async checkCan(permissions: string | string[], data?: any): Promise<boolean> {
    if (typeof permissions === "string" && permissions) permissions = [permissions];

    if (!permissions || !permissions.length) return true;

    for (let checkedPermission of permissions) {

      let permission = this.permissions[checkedPermission];

      if (!permission) throw new Error("Permission " + checkedPermission + " is not defined!");

      if (permission.roles && await this.hasRole(permission.roles)) return true;

      if (typeof permission.validate === "function") {
        let result = await Promise.resolve(permission.validate(checkedPermission, data));
        if (result) return true;
      }
    }

    return false;
  }

  async hasRole(allowedRoles: string | string[]): Promise<boolean> {
    // TODO: isnt there a better way to await ReplaySubject?
    const userRoles = await new Promise<string[]>((resolve,reject) => this.roles.pipe(first()).subscribe(roles => resolve(roles)));

    // normalize input to array
    if (typeof allowedRoles === "string") allowedRoles = [allowedRoles];

    // check for an intersection of roles
    return allowedRoles.some(role => userRoles.indexOf(role) !== -1);
  }

  setPermissions(permissions: AclPermissions): void {
    this.permissions = permissions;
    this.onUpdate.emit();
  }

  setRoles(roles: string[]): void {
    this.roles.next(roles);
    this.onUpdate.emit();
  }
}
