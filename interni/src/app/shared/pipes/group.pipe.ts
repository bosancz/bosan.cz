import { Pipe, PipeTransform } from "@angular/core";
import { MemberGroupID, MemberGroups } from "app/config/member-groups";

export type GroupPipeProperty = "name" | "color";

@Pipe({
  name: "group",
})
export class GroupPipe implements PipeTransform {
  groups = MemberGroups;

  defaultValues: { [key: string]: any } = {
    color: "#000",
  };

  constructor() {}

  transform(groupId: MemberGroupID | undefined, property: GroupPipeProperty): string | undefined {
    // if group properties not loaded yet or not present for group, return default values
    if (!groupId) return this.defaultValues[property];

    switch (property) {
      case "name":
        return this.groups?.[groupId]?.[property] || groupId;
      default:
        return this.groups?.[groupId]?.[property];
    }
  }
}
