import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";
import { LoginService } from "app/services/login.service";
import { ConfigService } from "app/services/config.service";
import { ToastService } from "app/services/toast.service";

import { User } from "app/shared/schema/user";

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {

  users: User[] = [];

  roleNames: any = {};

  active: boolean;

  paramsSubscription: Subscription;

  constructor(
    private api: ApiService,
    private loginService: LoginService,
    private configService: ConfigService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.loadUsers();
    });

    this.loadRoleNames();
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadUsers() {
    this.users = await this.api.get<User[]>("users", { members: 1 });
  }

  loadRoleNames() {
    this.configService.getConfig().then(config => {
      this.roleNames = {};
      config.users.roles.forEach(role => this.roleNames[role.name] = role.title);
    });
  }

  async impersonateUser(event: Event, user: User): Promise<void> {

    event.stopPropagation();

    await this.loginService.loginImpersonate(user._id);

    this.toastService.toast("Přihlášen jako " + user.login);
    this.router.navigate(["/"]);
  }
}
