import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { DataService } from "../services/data.service";

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {
  
  groupIndex:any = {};
  
  defaultValues:{ [key: string]: any } = {
    "color": "#000"    
  };
  
  constructor(dataService:DataService, private changeDetectorRef: ChangeDetectorRef){    
    
    dataService.getGroups({fields:"_id,name,color"})
      .then(groups => {
        
        // create group index with properties
        this.groupIndex = {};
        groups.forEach(group => this.groupIndex[group._id] = group);
        
        // inform Angular that refresh of the value is needed
        this.changeDetectorRef.markForCheck();
      })
      .catch(err => console.error(err));
  }

  transform(groupId:string,property:string):string{
    
    // if group properties not loaded yet or not present for group, return default values
    switch(property){
      case "name":
        return this.groupIndex[groupId] && this.groupIndex[groupId][property] || groupId;
      default:
        return (this.groupIndex[groupId] ? this.groupIndex[groupId][property] : this.defaultValues[property]) || "";
    }
  }

}
