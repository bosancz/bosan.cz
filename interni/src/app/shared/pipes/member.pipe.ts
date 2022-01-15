import { Pipe, PipeTransform } from '@angular/core';
import { MemberSelectorModalComponent } from 'app/modules/events/components/member-selector-modal/member-selector-modal.component';
import { Member } from 'app/schema/member';

@Pipe({
  name: 'member'
})
export class MemberPipe implements PipeTransform {

  transform(member: Member, property: "nickname") {

    switch (property) {
      case "nickname":
        return member.nickname || member.name?.first || member.name?.last || "?";
    }
  }

}
