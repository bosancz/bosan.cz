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
      this.groupIndex = (config?.members?.groups || []).reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
      this.cdRef.markForCheck();
    });
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
