import { AccessControlDefinition } from "./schema/access-control-definition";
import { Roles } from "./schema/roles";

export const AccessControlList: Record<string, Record<Roles, AccessControlDefinition>> = {
  events: {
    [Roles.vedouci]: {
      permission: true,
      filter,
    },
    [Roles.clen]: {},
  },
};
