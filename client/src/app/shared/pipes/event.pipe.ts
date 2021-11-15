import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { ConfigService } from "app/services/config.service";

import { Event } from "app/shared/schema/event";
import { WebConfigEventType, WebConfigEventSubType } from "app/shared/schema/webconfig";
import { EventTypes } from 'config/event-types';

type EventPipeProperty = "image" | "color" | "class";

@Pipe({
  name: 'event',
  pure: false
})
export class EventPipe implements PipeTransform {

  constructor() { }

  transform(event: Event, property: EventPipeProperty): string {
    if (!event) return;

    switch (property) {

      case "color":
      case "image":
        return EventTypes[event.subtype] && EventTypes[event.subtype][property] || "";

      default:
        return "?";
    }
  }

}
