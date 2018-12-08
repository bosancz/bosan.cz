import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { MyGroupModule } from "./my-group.module";

import { AuthService } from "app/services/auth.service";
import { ApiService } from "app/services/api.service";

import { Group } from "app/schema/group";
import { Member } from "app/schema/member";

@Injectable({
  providedIn: MyGroupModule
})
export class MyGroupService {
  
  groupId:BehaviorSubject<string> = new BehaviorSubject(undefined);

  constructor(private authService:AuthService, private api:ApiService) { 
    this.authService.user.subscribe(user => this.getGroupId(user));
  }
  
  async getGroupId(user){
    
    const member = await this.api.get<Member>("members:one",{_id:user.memberId,select:"_id group"});
    
    this.groupId.next(member.group);
    
  }
  
}
