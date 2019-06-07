import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Member } from 'app/shared/schema/member';
import { ApiService } from 'app/core/services/api.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'member-info-modal',
  templateUrl: './member-info-modal.component.html',
  styleUrls: ['./member-info-modal.component.scss']
})
export class MemberInfoModalComponent implements OnInit {

  memberId: string;

  member: Member;

  constructor(private api: ApiService, public modalRef: BsModalRef) { }

  ngOnInit() {
    this.loadMember(this.memberId);
  }

  async loadMember(memberId: string) {
    this.member = await this.api.get<Member>(["member", memberId]);
  }

  getAge(bdString: string): number {
    if (!bdString) return null;
    const today = DateTime.local().set({ hour: 0, minute: 0, millisecond: 0 });
    return Math.floor((-1) * DateTime.fromISO(bdString).diff(today, "years").toObject().years);
  }

}
