import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ApiService } from 'app/services/api.service';
import { LoginService } from 'app/services/login.service';
import { ToastService } from "app/services/toast.service";
import { Member } from "app/shared/schema/member";
import { User } from "app/shared/schema/user";
import { userRoles } from 'config/user-roles';
import { Subscription } from "rxjs";


@Component({
  selector: 'users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss']
})
export class UsersViewComponent implements OnInit, OnDestroy {

  user?: User;

  roles = userRoles
    .filter(item => item.assignable)
    .map(role => ({ name: role.id, title: role.title, active: false }));

  members: Member[] = [];

  category: string = "ucet";

  deleteConfirmation: boolean = false;

  paramsSubscription?: Subscription;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {

      if (params.user && (!this.user || this.user._id !== params.user)) this.loadUser(params.user);

      this.category = params.cat;

    });

    this.loadMembers();
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
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
    members.sort((a, b) => a.nickname.localeCompare(b.nickname));
    this.members = members;
  }

  async saveUser(userForm: NgForm) {

    if (!this.user) return;

    const userData = userForm.value;

    userData.roles = this.roles.filter(role => role.active).map(role => role.name);

    await this.api.patch(["user", this.user._id], userData);

    this.toastService.toast("Uloženo.");
  }

  async deleteUser() {

    if (!this.user) return;

    const confirmation = window.confirm(`Opravdu smazat uživatele ${this.user.login}?`);

    if (!confirmation) return;

    await this.api.delete(["user", this.user._id]);

    this.toastService.toast(`Uživatel byl smazán.`);

    this.router.navigate(["../../"], { relativeTo: this.route });
  }

  async impersonateUser(event: Event, user: User): Promise<void> {

    event.stopPropagation();

    await this.loginService.loginImpersonate(user._id);

    this.toastService.toast("Přihlášen jako " + user.login);
    this.router.navigate(["/"]);
  }

  hasRole(name: string) {
    return this.roles.some(role => role.name === name && role.active === true);
  }

};
