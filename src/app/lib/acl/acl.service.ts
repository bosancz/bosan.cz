import { Injectable, ApplicationRef, EventEmitter } from '@angular/core';

export interface AclPermissions {
  [name:string]:{
    roles?:string[],
    validate?:(name:string,data?:any) => boolean
  };
}

@Injectable({
  providedIn: 'root'
})
export class AclService {

  permissions:AclPermissions = {};
  
  roles:string[] = [];
  
  onUpdate:EventEmitter<void> = new EventEmitter();

  constructor(private appRef:ApplicationRef) { }

  async can(permissions:string|string[],data?:any):Promise<boolean>{
    if(typeof permissions === "string" && permissions) permissions = [permissions];
    
    if(!permissions || !permissions.length) return true;
    
    for(let checkedPermission of permissions){
      
      let permission = this.permissions[checkedPermission];
      
      if(!permission) throw new Error("Permission " + checkedPermission + " is not defined!");
      
      if(permission.roles && this.roles.some(role => permission.roles.indexOf(role) !== -1)) return true;
      
      if(typeof permission.validate === "function") {
        let result = await Promise.resolve(permission.validate(checkedPermission,data));
        if(result) return true;
      }
    }

    return false;
  }
  
  hasRole(roles:string|string[]):boolean{
    if(typeof roles === "string") roles = [roles];
    return roles.some(role => this.roles.indexOf(role) !== -1);
  }
  
  setPermissions(permissions:AclPermissions):void{
    this.permissions = permissions;
    this.onUpdate.emit();
  }
  
  setRoles(roles:string[]):void{
    this.roles = roles;
    this.onUpdate.emit();
  }
}
