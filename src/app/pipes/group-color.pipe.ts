import { Pipe, PipeTransform } from '@angular/core';

import { DataService } from "../services/data.service";

@Pipe({
  name: 'groupColor'
})
export class GroupColorPipe implements PipeTransform {
  
  groupColors:any;
  
  constructor(dataService:DataService){
    dataService.getGroupsColors()
      .then(groupColors => this.groupColors = groupColors)
      .catch(err => console.error(err));
  }

  transform(value:string):string{
    return this.groupColors[value] || "#ccc";
  }

}
