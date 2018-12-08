import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";

import { MyGroupService } from "../my-group.service";

@Component({
  selector: 'my-group-members',
  templateUrl: './my-group-members.component.html',
  styleUrls: ['./my-group-members.component.scss']
})
export class MyGroupMembersComponent implements OnInit, OnDestroy {

  members = [];
  
  groupSubscription:Subscription;

  constructor(private groupService:MyGroupService, private api:ApiService) { }

  ngOnInit() {
    this.groupSubscription = this.groupService.groupId.subscribe(groupId => this.loadMembers(groupId));
  }

  ngOnDestroy(){
    this.groupSubscription.unsubscribe();
  }
  
  async loadMembers(groupId:string){
    
  }
}
