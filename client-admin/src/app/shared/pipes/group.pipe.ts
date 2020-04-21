import { Pipe, PipeTransform, Injectable, ChangeDetectorRef } from '@angular/core';

import { ConfigService } from "app/services/config.service";
import { filter } from 'rxjs/operators';

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

  constructor(
    private configService: ConfigService,
    private cdRef: ChangeDetectorRef
  ) {

    this.configService.config.subscribe(config => {
      this.groupIndex = (config?.members?.groups || []).reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});
      this.cdRef.markForCheck();
    });
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
