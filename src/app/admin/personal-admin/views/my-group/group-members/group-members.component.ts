import { Component, OnInit } from '@angular/core';

import { MyGroupService } from "../my-group.service";

@Component({
  selector: 'group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.scss']
})
export class GroupMembersComponent implements OnInit {

  constructor(private myGroup:MyGroupService) { }

  ngOnInit() {
    
  }
  
  async loadMembers(){
  }
}
