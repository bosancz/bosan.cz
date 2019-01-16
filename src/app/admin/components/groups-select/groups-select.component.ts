import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { ConfigService } from "app/services/config.service";

@Component({
  selector: 'groups-select',
  templateUrl: './groups-select.component.html',
  styleUrls: ['./groups-select.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GroupsSelectComponent),
    }
  ]
})
export class GroupsSelectComponent implements OnInit, ControlValueAccessor {

  groups:string[] = [];
  selectedGroups:string[] = [];
  
  disabled:boolean = false;
  
  onChange:any = () => {};
  onTouched:any = () => {};
  
  writeValue(groups:any):void{ this.selectedGroups = groups || []; }
  registerOnChange(fn:any):void{ this.onChange = fn; }
  registerOnTouched(fn:any):void{ this.onTouched = fn; }
  setDisabledState(isDisabled:boolean):void{
    this.disabled = isDisabled;
    this.selectedGroups = [];
  }
  
  constructor(private configService:ConfigService) { }
  
  ngOnInit(){
    this.loadGroups();
  }
  
  loadGroups(){
    this.configService.getConfig().then(config => this.groups = config.members.groups.filter(group => group.active).map(group => group.id));
  }

  isSelected(group:string){
    return this.selectedGroups.indexOf(group) !== -1;
  }
  
  selectAll(checked:boolean):void{
    if(this.disabled) return;
    if(checked) this.selectedGroups = this.groups.slice();
    else this.selectedGroups = [];
    this.onChange(this.selectedGroups);
  }
  
  isSelectedAll():boolean{
    return this.selectedGroups.length === this.groups.length;
  }
  
  selectNone(checked:boolean):void{
    if(this.disabled) return;
    if(checked) this.selectedGroups = [];    
    this.onChange(this.selectedGroups);
  }
  
  isSelectedNone():boolean{
    return this.selectedGroups.length === 0;
  }
  
  toggleGroup(group:string){
    if(this.disabled) return;
    let i = this.selectedGroups.indexOf(group);
    if(i === -1) this.selectedGroups.push(group);
    else this.selectedGroups.splice(i,1);
    this.onChange(this.selectedGroups);
  }

}
