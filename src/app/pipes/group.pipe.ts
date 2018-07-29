import { Pipe, PipeTransform } from '@angular/core';

import { DataService } from "../services/data.service";

@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {
  
  groupIndex:any;
  
  constructor(dataService:DataService){
    
    console.log("constructor");
    
    dataService.getGroups({fields:"_id,name,color"})
      .then(groups => {
        this.groupIndex = {};
        groups.forEach(group => this.groupIndex[group._id] = group);
      })
      .catch(err => console.error(err));
  }

  transform(groupId:string,property:string):string{
    if(!this.groupIndex[groupId]) return;
    return this.groupIndex[groupId][property];
  }

}
