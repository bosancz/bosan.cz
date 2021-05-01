import { Pipe, PipeTransform } from '@angular/core';

import { FormatPhonePipe } from "./format-phone.pipe";

@Pipe({
  name: 'joinLeaders'
})
export class JoinLeadersPipe implements PipeTransform {

  transform(value: any[], showPhone: boolean = true, html: boolean = true): string {

    if (!value || !value.length) return "";

    const formatPhonePipe = new FormatPhonePipe();

    const leadersStrings = value
      .map(leader => {
        let leaderString = leader.nickname || leader.name?.first || leader.name?.last || "???";
        if (showPhone && leader.contacts && leader.contacts.mobile) leaderString += " (" + formatPhonePipe.transform(leader.contacts.mobile, "short", true) + ")";
        return leaderString;
      })
      .map(leaderString => html ? leaderString.replace(/ /g, "&nbsp;") : leaderString);

    return leadersStrings.length > 1 ? leadersStrings.slice(0, leadersStrings.length - 1).join(", ") + (html ? " a&nbsp;" : " a ") + leadersStrings[leadersStrings.length - 1] : leadersStrings[0];
  }

}
