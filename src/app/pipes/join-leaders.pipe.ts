import { Pipe, PipeTransform } from '@angular/core';

import { FormatPhonePipe } from "./format-phone.pipe";

@Pipe({
  name: 'joinLeaders'
})
export class JoinLeadersPipe implements PipeTransform {

  transform(value:any[], phone:boolean = true):string{
    
    const formatPhonePipe = new FormatPhonePipe();
    
    const leadersStrings = value.map(leader => leader.nickname + (phone && leader.contacts && leader.contacts.mobile ? " (" + formatPhonePipe.transform(leader.contacts.mobile,"short",true) + ")" : ""));
    
    return leadersStrings.length > 1 ? leadersStrings.slice(0,leadersStrings.length - 1).join(", ") + " a " + leadersStrings[leadersStrings.length - 1] : leadersStrings[0];
  }

}
