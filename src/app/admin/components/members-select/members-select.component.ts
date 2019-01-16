import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { ConfigService } from "app/services/config.service";
import { ApiService } from "app/services/api.service";

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

  @Input() role:string;
  
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
  
  constructor(private api:ApiService, private configService:ConfigService) {
  }

  ngOnInit() {
    this.loadMembers();
    this.loadConfig();
  }
  
  ngOnChanges(){
    
  }
  
  async loadMembers(){    
    const options = {
      role: this.role      
    }
    
    this.members = await this.api.get<Member[]>("members",options);
    this.members.sort((a,b) => a.nickname.localeCompare(b.nickname));
    // TODO: diacritics insensitive search
    this.searchIndex = this.members.map((member,i) => {
      let names = member.nickname + (member.name ? (" " + member.name.first + " " + member.name.last) : "");
      
      names = names.toLowerCase();
      names = this.specialCharsReplace(names);
      return names;
    });      
  }
  
  loadConfig(){
    this.configService.getConfig().then(config => {
      this.groups = config.members.groups;
      this.roles = config.members.roles.map(item => item.id);
    });
  }
  
  setSearch(search:string){
    search = this.specialCharsReplace(search);
    if(search) this.search = new RegExp(search.toLowerCase());
    else this.search = null;
  }
  
  isHidden(member:Member,i:number):boolean{
    return this.search && !this.search.test(this.searchIndex[i]);
  }
  
  selectedMember(member:Member):boolean{
    return this.selectedMembers.some(item => item._id === member._id);
  }
  
  toggleMember(member:Member,select:boolean):void{
    if(select && !this.selectedMember(member)) this.selectedMembers.push(member);
    if(!select) this.selectedMembers = this.selectedMembers.filter(item => item._id !== member._id);
    this.onChange(this.selectedMembers);
  }
  
  specialCharsReplace(string:string){
    const replaceChars = ["áčďéěíľňóřšťúůýž","acdeeilnorstuuyz"];
    return string.replace(/[áčďéěíľňóřšťúůýž]/g,char => replaceChars[1].charAt(replaceChars[0].indexOf(char))); 
  }

}
