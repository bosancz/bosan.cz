import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRoles } from 'app/config/user-roles';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from "app/core/services/toast.service";
import { Member } from "app/schema/member";
import { User } from "app/schema/user";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';

@UntilDestroy()
@Component({
  selector: 'bo-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {

  user?: User;

  roles = UserRoles
    .filter(item => item.assignable)
    .map(role => ({ name: role.id, title: role.title, active: false }));

  members: Member[] = [];

  category: string = "ucet";

  actions: Action[] = [
    {
      text: "Uložit",
      handler: () => this.saveUser()
    }
  ];

  @ViewChild("editUserForm") form!: NgForm;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.route.params
      .pipe(untilDestroyed(this))
      .subscribe((params: Params) => {

        if (params.user && (!this.user || this.user._id !== params.user)) this.loadUser(params.user);

        this.category = params.cat;

      });

    this.loadMembers();
  }

  // DB interaction
  async loadUser(userId: string) {
    this.user = await this.api.get<User>(["user", userId]);
    this.updateRoles(this.user);
  }

  updateRoles(user: User): void {
    this.roles.forEach(role => role.active = (user.roles.indexOf(role.name) !== -1));
  }

  async loadMembers() {
    let members = await this.api.get<Member[]>("members");
    members.sort((a, b) => (a.nickname || "").localeCompare(b.nickname || ""));
    this.members = members;
  }

  async saveUser() {

    if (!this.user) return;

    const userData = this.form.value;

    await this.api.patch(["user", this.user._id], userData);

    this.toastService.toast("Uloženo.");

    this.router.navigate(["../"], { relativeTo: this.route, replaceUrl: true });
  }

  hasRole(name: string) {
    return this.roles.some(role => role.name === name && role.active === true);
  }

};