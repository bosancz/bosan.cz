import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { Member } from 'app/schema/member';

@Component({
  selector: 'bo-member-selector-modal',
  templateUrl: './member-selector-modal.component.html',
  styleUrls: ['./member-selector-modal.component.scss']
})
export class MemberSelectorModalComponent implements OnInit {

  members: Member[] = [];

  constructor(
    private api: ApiService,
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.searchMembers();
  }

  async searchMembers(searchString?: string) {

    const params = {
      search: searchString || undefined,
      sort: "name",
      limit: 20
    };

    this.members = await this.api.get<Member[]>("members", params);
  }

  close(member?: Member) {
    this.modalController.dismiss({ member: member });
  }
}
