import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { DataService } from "../../../services/data.service";

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
export class GroupsSelectComponent implements ControlValueAccessor {

  groups:string[] = [];
  selectedGroups:string[] = [];
  
  disabled:boolean = false;
  
  onChange:any = () => {};
  onTouched:any = () => {};
  
  writeValue(groups:any):void{ this.selectedGroups = groups || []; }
  registerOnChange(fn: any): void{ this.onChange = fn; }
  registerOnTouched(fn: any): void{ this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void{ this.disabled = isDisabled; }
  
  constructor(private dataService:DataService) { }
  
  ngOnInit(){
    this.loadGroups();
  }
  
  async loadGroups(){
    let config = await this.dataService.getConfig();
    this.groups = config.members.groups.map(group => group.id);
  }

  isSelected(group:string){
    return this.selectedGroups.indexOf(group) !== -1;
  }
  
  toggleGroup(group:string){
    if(this.disabled) return;
    let i = this.selectedGroups.indexOf(group);
    if(i === -1) this.selectedGroups.push(group);
    else this.selectedGroups.splice(i,1);
  }

}
