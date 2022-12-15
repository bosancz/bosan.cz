import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { AcEntityInterceptor } from "../interceptors/ac-entity-response.interceptor";

export type EntitiesStoreItem = {
  entity: string;
  method: string;
  controller: any;
  handler: any;
};

export const EntitiesStore: EntitiesStoreItem[] = [];

export function AcEntity(entity: string) {
  return (target: any, method: string, descriptor: PropertyDescriptor) => {
    EntitiesStore.push({
      entity,
      method,
      controller: target,
      handler: descriptor.value,
    });

    return applyDecorators(SetMetadata("entity", entity), UseInterceptors(AcEntityInterceptor))(target, method, descriptor);
  };
}
