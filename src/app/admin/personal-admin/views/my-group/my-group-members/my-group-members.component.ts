import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";

import { Member } from "app/schema/member";

@Component({
  selector: 'my-group-members',
  templateUrl: './my-group-members.component.html',
  styleUrls: ['./my-group-members.component.scss']
})
export class MyGroupMembersComponent implements OnInit {

  members:Member[] = [];
  
  constructor(private api:ApiService) { }

  ngOnInit() {
    this.loadMembers();
  }
  
  async loadMembers(){
    this.members = await this.api.get<Member[]>("me:group:members");
  }
  
  getRoleMembers(members:Member[], role:string):Member[]{
    return members.filter(member => member.role === role);
  }
}
