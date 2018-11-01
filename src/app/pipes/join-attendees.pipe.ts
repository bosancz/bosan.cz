import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinAttendees'
})
export class JoinAttendeesPipe implements PipeTransform {

  transform(attendees: any[]): string {
    
    if(!attendees || !attendees.length) return "";
    
    const names = attendees.map(attendee => attendee.nickname || "???");
    
    return (names.length > 1 ? names.slice(0,names.length - 2).join(", ") + " a " : "") + names[names.length - 1];
    
  }

}
