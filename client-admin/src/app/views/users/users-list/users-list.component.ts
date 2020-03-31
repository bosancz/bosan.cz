import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subscription, BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";

import { ApiService } from "app/services/api.service";
import { LoginService } from "app/services/login.service";
import { ConfigService } from "app/services/config.service";
import { ToastService } from "app/services/toast.service";

import { User } from "app/shared/schema/user";
import { WithSearchString } from 'app/shared/schema/with-search-string';
import { debounceTime, map } from 'rxjs/operators';
import { WebConfigUserRole } from 'app/shared/schema/webconfig';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy, AfterViewInit {

  users$ = new Subject<WithSearchString<User>[]>();
  filteredUsers$: Observable<WithSearchString<User>[]>;

  filter$ = new Subject<any>();

  roles: WebConfigUserRole[] = [];
  roleNames: any = {};

  active: boolean;

  @ViewChild('filterForm', { static: true }) filterForm: NgForm;

  showFilter: boolean = false;

  search$ = new BehaviorSubject<string>("");

  paramsSubscription: Subscription;

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private route: ActivatedRoute,
  ) {

    this.filteredUsers$ = combineLatest([this.users$, this.filter$])
      .pipe(map(([members, filter]) => this.filterUsers(filter, members)));

  }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.loadUsers();
    });

    this.loadRoles();
  }

  ngAfterViewInit() {
    this.filterForm.valueChanges.pipe(debounceTime(250)).subscribe(this.filter$);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadUsers() {
    const users: WithSearchString<User>[] = await this.api.get<User[]>("users", { members: 1 });

    users.forEach(user => {
      user.searchString = [
        user.login,
        user.member && user.member.nickname,
        user.member && user.member.name && user.member.name.first,
        user.member && user.member.name && user.member.name.last
      ].filter(item => !!item).join(" ");
    })

    this.users$.next(users);
  }

  filterUsers(filter: any, users: WithSearchString<User>[]) {

    const search_re = filter.search ? new RegExp("(^| )" + filter.search.replace(/ /g, "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i") : undefined;

    return users.filter(user => {
      if (search_re && !search_re.test(user.searchString)) return false;
      if (filter.role && filter.role.length && !filter.role.some(filterRole => user.roles.indexOf(filterRole) !== -1)) return false;

      return true;
    });
  }

  async loadRoles() {
    const config = await this.configService.getConfig()
    this.roles = config.users.roles;
    this.roleNames = this.roles.reduce((acc, cur) => (acc[cur.name] = cur.title, acc), {} as { [name: string]: string });
  }
  
}
