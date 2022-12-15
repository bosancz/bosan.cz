import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestMethod } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { Config } from "src/config";
import { Document } from "src/schema/document";
import { EntitiesStore, EntitiesStoreItem } from "../decorators/ac-entity.decorator";

type DocumentResponse<T> = T & Document<string, string>;

type Response<T> = DocumentResponse<T> | DocumentResponse<T>[];

@Injectable()
export class AcEntityInterceptor<T = any> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(map((res) => this.addLinksToResponse(res, context)));
  }

  private addLinksToResponse(res: T, context: ExecutionContext): Response<T> {
    const entity = this.reflector.get("entity", context.getHandler());

    if (Array.isArray(res)) {
      return res.map((d) => this.addLinksToEntity(d, entity));
    } else {
      return this.addLinksToEntity(res, entity);
    }
  }

  private addLinksToEntity(doc: T, entity: string): DocumentResponse<T> {
    const _links = {};

    _links["self"] = this.createEntityLink(this.findSelfEntity(entity));

    this.findChildEntities(entity).forEach((childEntity) => {
      _links[childEntity.entity] = this.createEntityLink(childEntity);
    });

    const _actions = {};

    return {
      ...doc,
      _links,
      _actions,
    };
  }

  private findSelfEntity(entity: string) {
    return EntitiesStore.find((e) => e.entity === entity);
  }

  private findChildEntities(entity: string) {
    return EntitiesStore.filter((e) => e.entity.startsWith(entity + ":"));
  }

  private createEntityLink(entity: EntitiesStoreItem) {
    return {
      method: this.getHttpMethod(entity),
      path: this.getPath(entity),
    };
  }

  private getHttpMethod(entity: EntitiesStoreItem) {
    return RequestMethod[Reflect.getMetadata("method", entity.handler)];
  }
  private getPath(entity: EntitiesStoreItem) {
    const controllerTarget = Reflect.getMetadata("controller", entity.controller);
    const controllerPath = Reflect.getMetadata("path", controllerTarget) || "";
    const methodPath = Reflect.getMetadata("path", entity.handler);

    const pathItems = [Config.app.baseUrl, "api", controllerPath, methodPath];

    const path = pathItems
      .map((item) => item.replace(/^\//, "").replace(/\/$/, ""))
      .filter((item) => !!item)
      .join("/");

    return path;
  }
}
