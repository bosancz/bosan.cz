// @ts-nocheck
import { WebConfig } from "app/schema/web-config";
import { Codelist } from '../core/components/codelist-editor/codelist-editor.component';

export interface WebConfigStructureItemDef<U> {
  name: U;
  label?: string;
  help?: string;
  placeholder?: string;
}

export type WebConfigStructureItem<U = any> = (
  WebConfigStructureItemDef<U> & { type: "string", default?: string; }
  | WebConfigStructureItemDef<U> & { type: "number", default?: number; }
  | WebConfigStructureItemDef<U> & { type: "codelist"; } & Codelist
);

export interface WebConfigStructureGroup<T extends keyof WebConfig = keyof WebConfig> {
  name: T;
  label?: string;
  items: WebConfigStructureItem<keyof WebConfig[T]>[];
}

export type WebConfigStructure = [
  WebConfigStructureGroup<"general">,
  WebConfigStructureGroup<"contacts">,
];