import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from "app/services/config.service";
import { Event } from "app/shared/schema/event";
import { WebConfigEventSubType, WebConfigEventType } from "app/shared/schema/web-config";

type EventPipeProperty = "image" | "color" | "class";

@Pipe({
  name: 'event',
  pure: false
})
export class EventPipe implements PipeTransform {

  eventTypes: {
    [name: string]: WebConfigEventType;
  } = {};

  eventSubTypes: {
    [name: string]: WebConfigEventSubType;
  } = {};

  constructor(
    private configService: ConfigService,
    private cdRef: ChangeDetectorRef
  ) {

    this.configService.config.subscribe(config => {
      this.eventTypes = (config?.events?.types || []).reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});
      this.eventSubTypes = (config?.events?.subtypes || []).reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});
      this.cdRef.markForCheck();
    });

  }

  transform(event: Event, property: EventPipeProperty): string {

    switch (property) {

      case "class":
        return this.eventTypes[event.type] && this.eventTypes[event.type][property] || "";

      case "color":
      case "image":
        return this.eventSubTypes[event.subtype] && this.eventSubTypes[event.subtype][property] || "";

      default:
        return "?";
    }
  }

}
