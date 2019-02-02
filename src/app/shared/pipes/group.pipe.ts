import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { ConfigService } from "app/core/services/config.service";

enum GroupProperty {
  name = "name",
    color = "color"
}

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {

  groupIndex:any = {};

  defaultValues:{ [key:string]:any } = {
    "color": "#000"    
  };

  constructor(private configService:ConfigService, private changeDetectorRef:ChangeDetectorRef){    
    this.loadGroups();
  }

  loadGroups(){
    this.configService.config.subscribe(config => {

      // create group index with properties
      this.groupIndex = {};
      config.members.groups.forEach(group => this.groupIndex[group.id] = group);

      // inform Angular that refresh of the value is needed
      this.changeDetectorRef.markForCheck();
    })
  }

  transform(groupId:string,property:GroupProperty):string{

    // if group properties not loaded yet or not present for group, return default values
    switch(property){
      case "name":
        return this.groupIndex[groupId] && this.groupIndex[groupId][property] || groupId;
      default:
        return (this.groupIndex[groupId] ? this.groupIndex[groupId][property] : this.defaultValues[property]) || "";
    }
  }

}
