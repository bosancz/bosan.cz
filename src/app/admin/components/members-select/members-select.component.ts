import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataService } from "../../../services/data.service";

import { Member } from "../../../schema/member";
import { Group } from "../../../schema/group";

@Component({
  selector: 'members-select',
  templateUrl: './members-select.component.html',
  styleUrls: ['./members-select.component.scss']
})
export class MembersSelectComponent implements OnInit {

  @Input() options:any = {};
  @Input() selected:string[] = [];
  
  @Output() select:EventEmitter<Member> = new EventEmitter();
  @Output() unselect:EventEmitter<Member> = new EventEmitter();
  
  members:Member[] = [];
  
  groups:Group[] = [];
  
  constructor(private dataService:DataService) {
  }

  ngOnInit() {
    this.loadMembers();
    this.loadGroups();
  }
  
  async loadMembers(){    
    this.members = await this.dataService.getMembers(this.options);    
  }
  
  async loadGroups(){
    this.groups = await this.dataService.getGroups();
  }
  
  selectedMember(member:Member):boolean{
    return this.selected.indexOf(member._id) !== -1;
  }
  
  selectMember(member:Member,select:boolean):void{
    select ? this.select.emit(member) : this.unselect.emit(member);
  }

}
