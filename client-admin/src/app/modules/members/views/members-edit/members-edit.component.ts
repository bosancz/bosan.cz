import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MemberGroups } from 'app/config/member-groups';
import { MemberRoles } from 'app/config/member-roles';
import { MembershipTypes } from 'app/config/membership-types';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { Member } from 'app/schema/member';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'members-edit',
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.scss']
})
export class MembersEditComponent {

  member?: Member;

  groups = Object.entries(MemberGroups)
    .map(entry => ({ key: entry[0], value: entry[1] }))
    .filter(entry => entry.value.real);

  roles = MemberRoles;
  membershipTypes = MembershipTypes;

  paramsSubscription?: Subscription;

  @ViewChild("memberInfoForm") form!: NgForm;

  actions: Action[] = [
    {
      text: "Uložit",
      pinned: true,
      handler: () => this.saveMember()
    }
  ];

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController
  ) {
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.loadMember(params["member"]);
    });
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

  async loadMember(memberId: string) {
    this.member = await this.api.get<Member>(["member", memberId]);
  }


  async saveMember() {

    if (!this.member) return;

    const memberData = this.form.value;

    await this.api.patch(["member", this.member._id], memberData);

    await this.loadMember(this.member._id);

    this.toastService.toast("Uloženo.");

    this.navController.navigateBack(["/databaze", this.member._id]);
  }

}
