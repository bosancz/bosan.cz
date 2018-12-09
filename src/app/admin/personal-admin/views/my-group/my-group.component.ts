import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";

import { MyGroupService } from "./my-group.service";

import { Group } from "app/schema/group";

@Component({
  selector: 'my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.scss']
})
export class MyGroupComponent implements OnInit {
  
  groupId:string;
  
  groupSubscription:Subscription;

  constructor(private groupService:MyGroupService) { }

  ngOnInit() {
    this.groupSubscription = this.groupService.groupId.subscribe(groupId => this.groupId = groupId);
  }
  
  ngOnDestroy(){
    this.groupSubscription.unsubscribe();
  }

}
