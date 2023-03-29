import { Pipe, PipeTransform } from '@angular/core';
import { EventTypes } from 'app/config/event-types';
import { Event } from "app/schema/event";

type EventPipeProperty = "image" | "color" | "class";

@Pipe({
  name: 'event',
  pure: false
})
export class EventPipe implements PipeTransform {

  eventTypes = EventTypes;

  defaultProperties: { [property: string]: any; } = {

  };

  constructor() { }

  transform(event: Event | undefined, property: EventPipeProperty): string {

    if (!event) return this.defaultProperties[property];

    switch (property) {

      case "color":
      case "image":
        return this.eventTypes?.[event.subtype]?.[property] || "";

      default:
        return "?";
    }
  }

}
