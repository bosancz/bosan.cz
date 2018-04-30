import { Pipe, PipeTransform } from '@angular/core';

import { DataService } from "../services/data.service";

@Pipe({
  name: 'groupColor'
})
export class GroupColorPipe implements PipeTransform {
  
  colors:any;
  
  constructor(dataService:DataService){
    dataService.getGroups({fields:"_id,color"})
      .then(groups => {
        this.colors = {};
        groups.forEach(group => this.colors[group._id] = group.color);
      })
      .catch(err => console.error(err));
  }

  transform(groupId:string):string{
    return this.colors[groupId] || "#ccc";
  }

}
