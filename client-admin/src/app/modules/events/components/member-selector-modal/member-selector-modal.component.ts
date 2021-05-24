import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ViewDidEnter } from '@ionic/angular';
import { Member } from 'app/schema/member';

@Component({
  selector: 'bo-member-selector-modal',
  templateUrl: './member-selector-modal.component.html',
  styleUrls: ['./member-selector-modal.component.scss']
})
export class MemberSelectorModalComponent implements OnInit, ViewDidEnter {

  @Input() members: Member[] = [];

  membersIndex: string[] = [];

  filteredMembers: Member[] = [];

  @ViewChild("searchBar") searchBar!: IonSearchbar;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.sortMembers();

    this.createIndex();

    this.searchMembers();
  }

  ionViewDidEnter() {
    // TODO: remove setTimeout when following bug gets resolved
    // https://github.com/ionic-team/ionic-framework/issues/17745
    window.setTimeout(() => this.searchBar.setFocus(), 300);
  }

  searchMembers(searchString?: string) {
    if (!searchString) {
      this.filteredMembers = this.members;
      return;
    }

    searchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
    const re = new RegExp("(^| )" + searchString, "i");

    this.filteredMembers = this.members.filter((member, i) => re.test(this.membersIndex[i]));

  }

  private createIndex() {
    this.membersIndex = this.members.map(member => {
      return [member.nickname, member.name?.first, member.name?.last]
        .filter(value => !!value)
        .join(" ");
    });
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
