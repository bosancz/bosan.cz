import { FindOptionsWhere } from "typeorm";

export type AccessControlFilter = FindOptionsWhere<any>;

export interface AccessControlObject {
  permission: boolean | (() => boolean);
  filtler?: boolean | (() => AccessControlFilter);
}

export type AccessControlDefinition = boolean | AccessControlObject;
