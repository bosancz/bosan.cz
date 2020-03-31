import { Pipe, PipeTransform, Injectable } from '@angular/core';

import { ConfigService } from "app/services/config.service";

export type GroupPipeProperty = "name" | "color";

@Injectable()
@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {

  groupIndex: any = {};

  defaultValues: { [key: string]: any } = {
    "color": "#000"
  };

  constructor(private configService: ConfigService) {
    this.loadGroups();
  }

  loadGroups() {
    this.configService.config.subscribe(config => {

      // create group index with properties
      this.groupIndex = {};
      config.members.groups.forEach(group => this.groupIndex[group.id] = group);
    })
  }

  transform(groupId: string, property: GroupPipeProperty): string {

    // if group properties not loaded yet or not present for group, return default values
    switch (property) {
      case "name":
        return this.groupIndex[groupId] && this.groupIndex[groupId][property] || groupId;
      default:
        return (this.groupIndex[groupId] ? this.groupIndex[groupId][property] : this.defaultValues[property]) || "";
    }
  }

}
