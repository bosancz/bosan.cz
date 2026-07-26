import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';

import { Event } from "app/shared/schema/event";
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
        return EventTypes[event.type] && EventTypes[event.type][property] || "";

      default:
        return "?";
    }
  }

}
