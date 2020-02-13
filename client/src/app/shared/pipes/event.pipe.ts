import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { ConfigService } from "app/core/services/config.service";

import { Event } from "app/shared/schema/event";
import { WebConfigEventType, WebConfigEventSubType } from "app/shared/schema/webconfig";

enum EventPipeProperty {
  image = "image", color = "color", class = "class"
}

@Pipe({
  name: 'event'
})
export class EventPipe implements PipeTransform {

  eventTypes: {
    [name: string]: WebConfigEventType
  } = {};

  eventSubTypes: {
    [name: string]: WebConfigEventSubType
  } = {};

  constructor(private configService: ConfigService, private changeDetectorRef: ChangeDetectorRef) {
    this.loadEvents();
  }

  loadEvents() {
    this.configService.getConfig().then(config => {      
      this.eventTypes = config.events.types.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});
      this.eventSubTypes = config.events.subtypes.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});
    });
  }

  transform(event: Event, property: EventPipeProperty): string {
    console.log(this.eventSubTypes);
    if (!event) return;

    switch (property) {

      case "class":
        return this.eventTypes[event.type] && this.eventTypes[event.type][property] || "";

      case "color":
      case "image":
        return this.eventSubTypes[event.subtype] && this.eventSubTypes[event.subtype][property] || "";

      default:
        console.error("Invalid event pipe property: " + property);
        return undefined;
    }
  }

}
