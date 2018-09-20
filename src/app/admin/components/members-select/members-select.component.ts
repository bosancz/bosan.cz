import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { DataService } from "app/services/data.service";

import { Member } from "app/schema/member";
import { WebConfigGroup } from "app/schema/webconfig";

@Component({
  selector: 'members-select',
  templateUrl: './members-select.component.html',
  styleUrls: ['./members-select.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MembersSelectComponent),
    }
  ]
})
export class MembersSelectComponent implements OnInit, ControlValueAccessor {

  
  @Input() options:{
    group:string,
    role:string,
    status:string
  } = {
    group:"",
    role:"",
    status:""
  };
  
  members:Member[] = [];
  selectedMembers:Member[] = [];
  
  search:RegExp;
  searchIndex:string[];
  
  groups:WebConfigGroup[] = [];
  roles:string[] = [];

  disabled:boolean = false;
  
  onChange:any = () => {};
  onTouched:any = () => {};
  
  writeValue(members:Member[]):void{ this.selectedMembers = members || []; }
  registerOnChange(fn:any):void{ this.onChange = fn; }
  registerOnTouched(fn:any):void{ this.onTouched = fn; }
  setDisabledState(isDisabled:boolean):void{ this.disabled = isDisabled; }
  
  constructor(private dataService:DataService) {
  }

  ngOnInit() {
    this.loadMembers();
    this.loadGroups();
    this.loadRoles();
  }
  
  async loadMembers(){    
    this.members = await this.dataService.getMembers();  
    this.members.sort((a,b) => a.nickname.localeCompare(b.nickname));
    // TODO: diacritics insensitive search
    this.searchIndex = this.members.map((member,i) => {
      let names = member.nickname + (member.name ? (" " + member.name.first + " " + member.name.last) : "");
      return names.toLowerCase();
    });      
  }
  
  async loadGroups(){
    let config = await this.dataService.getConfig();
    this.groups = config.members.groups;
  }
  
  async loadRoles(){
    let config = await this.dataService.getConfig();
    this.roles = config.members.roles.map(item => item.id);
  }
  
  setSearch(search:string){
    if(search) this.search = new RegExp(search.toLowerCase());
    else this.search = null;
  }
  
  isHidden(member:Member,i:number):boolean{
    return Object.entries(this.options).some(entry => entry[1] && entry[1] !== member[entry[0]]) || (this.search && !this.search.test(this.searchIndex[i]));
  }
  
  selectedMember(member:Member):boolean{
    return this.selectedMembers.some(item => item._id === member._id);
  }
  
  toggleMember(member:Member,select:boolean):void{
    if(select && !this.selectedMember(member)) this.selectedMembers.push(member);
    if(!select) this.selectedMembers = this.selectedMembers.filter(item => item._id !== member._id);
    this.onChange(this.selectedMembers);
  }

}
