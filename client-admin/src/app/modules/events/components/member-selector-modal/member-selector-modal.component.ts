import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { Member } from 'app/schema/member';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'bo-member-selector-modal',
  templateUrl: './member-selector-modal.component.html',
  styleUrls: ['./member-selector-modal.component.scss']
})
export class MemberSelectorModalComponent implements OnInit {

  members: Member[] = [];

  membersIndex: string[] = [];

  filteredMembers: Member[] = [];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.sortMembers();

    this.createIndex();

    this.searchMembers();
  }

  searchMembers(searchString?: string) {
    console.log(searchString);
    if (!searchString) {
      this.filteredMembers = this.members;
      return;
    }

    searchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
    const re = new RegExp("(^| )" + searchString, "i");

    this.filteredMembers = this.members.filter((member, i) => re.test(this.membersIndex[i]));

  }

  private createIndex() {
    this.membersIndex = this.members.map(member => ([member.name, member.name.first, member.name.last].join(" ")));
  }

  private sortMembers() {
    this.members.sort((a, b) => {
      const aString = a.nickname || a.name?.first || a.name?.last || "";
      const bString = b.nickname || b.name?.first || b.name?.last || "";
      return aString.localeCompare(bString);
    });
  }

  close(member?: Member) {
    this.modalController.dismiss({ member: member });
  }
}
