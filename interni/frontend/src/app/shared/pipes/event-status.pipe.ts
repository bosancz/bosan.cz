import { Pipe, PipeTransform } from '@angular/core';
import { EventStatus, EventStatuses, EventStatusID } from 'app/config/event-statuses';

@Pipe({
  name: 'eventStatus'
})
export class EventStatusPipe implements PipeTransform {

  statuses = EventStatuses;

  defaultValues: { [key: string]: any; } = {
    "color": "#ccc"
  };

  transform(status: EventStatusID | undefined, property: keyof EventStatus): string | undefined {

    // if group properties not loaded yet or not present for group, return default values
    if (!status) return this.defaultValues[property];

    switch (property) {
      case "name":
        return this.statuses?.[status]?.[property] || status;
      default:
        return this.statuses?.[status]?.[property];
    }
  }

}
