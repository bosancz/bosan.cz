import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { DataService } from "../../../../../services/data.service";

import { Member } from "../../../../../schema/member";
import { Group } from "../../../../../schema/group";

@Component({
  selector: 'member-admin-info',
  templateUrl: './member-admin-info.component.html',
  styleUrls: ['./member-admin-info.component.css']
})
export class MemberAdminInfoComponent implements OnInit {

  @Input()  member:Member;
  
  @Output() save:EventEmitter<any> = new EventEmitter();
  
  groups:Group[] = [];
  roles:string[] = [];
  
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.loadGroups();
    this.loadRoles();
  }
  
  async loadGroups(){
    this.groups = await this.dataService.getGroups()
  }
  
  async loadRoles(){
    var config = await this.dataService.getConfig();
    this.roles = config.members.roles.map(item => item.id);
  }
  
  saveMember(form:NgForm){
    this.save.emit(form.value);
  }

}
