import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";

import { Member } from "../../schema/member";

@Component({
  selector: 'members-admin',
  templateUrl: './members-admin.component.html',
  styleUrls: ['./members-admin.component.css']
})
export class MembersAdminComponent implements OnInit {

  members:Member[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadMembers();
  }
  
  loadMembers():void{
    this.dataService.getMembers().then(members => this.members = members);
  }

}
