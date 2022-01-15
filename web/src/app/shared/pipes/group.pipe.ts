import { Pipe, PipeTransform, Injectable } from '@angular/core';

import { ConfigService } from "app/services/config.service";
import { MemberGroups } from 'config/member-groups';

export type GroupPipeProperty = "name" | "color";

@Injectable()
@Pipe({
  name: 'group'
})
export class GroupPipe implements PipeTransform {

  constructor() { }

  transform(groupId: string, property: GroupPipeProperty): string {

    switch (property) {
      case "name":
        return MemberGroups[groupId]?.[property] || groupId;
      case "color":
        return MemberGroups[groupId]?.[property] || "#000";
    }
  }

}
