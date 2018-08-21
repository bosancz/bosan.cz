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

  @Input() selected:string[] = [];
  
  @Input() options:{
    group:string,
    role:string,
    status:string
  } = {
    group:"",
    role:"",
    status:""
  };
  
  search:RegExp;
  
  @Output() select:EventEmitter<Member> = new EventEmitter();
  @Output() unselect:EventEmitter<Member> = new EventEmitter();
  
  members:Member[] = [];
  
  groups:Group[] = [];
  roles:string[] = [];
  
  searchIndex:string[];
  
  constructor(private dataService:DataService) {
  }

  ngOnInit() {
    this.loadMembers();
    this.loadGroups();
    this.loadRoles();
  }
  
  async loadMembers(){    
    this.members = await this.dataService.getMembers();  
    this.members.sort((a,b) => a.nickname.localeCompare(b.nickname))
    // TODO: diacritics insensitive search
    this.searchIndex = this.members.map((member,i) => {
      let names = member.nickname + (member.name ? (" " + member.name.first + " " + member.name.last) : "");
      return names.toLowerCase();
    });      
  }
  
  async loadGroups(){
    this.groups = await this.dataService.getGroups();
  }
  
  async loadRoles(){
    var config = await this.dataService.getConfig();
    this.roles = config.members.roles.map(item => item.id);
  }
  
  setSearch(search:string){
    if(search) this.search = new RegExp(search.toLowerCase());
    else this.search = null;
  }
  
  isHidden(member:Member,i:number):boolean{
    return Object.entries(this.options).some(entry => {
      return (entry[1] && entry[1] != member[entry[0]]) || (this.search && !this.search.test(this.searchIndex[i]));
    });
  }
  
  selectedMember(member:Member):boolean{
    return this.selected.indexOf(member._id) !== -1;
  }
  
  selectMember(member:Member,select:boolean):void{
    select ? this.select.emit(member) : this.unselect.emit(member);
  }

}
