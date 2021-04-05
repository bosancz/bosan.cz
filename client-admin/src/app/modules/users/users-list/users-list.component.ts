import { importExpr } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from "app/core/services/api.service";
import { ConfigService } from "app/core/services/config.service";
import { User } from "app/schema/user";
import { WithSearchString } from 'app/schema/with-search-string';
import { userRoles } from 'app/config/user-roles';
import { BehaviorSubject, combineLatest, Observable, Subject, Subscription } from "rxjs";
import { debounceTime, map } from 'rxjs/operators';

type UsersFilter = {
  search: string;
  role: string[];
};

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy, AfterViewInit {

  users$ = new Subject<WithSearchString<User>[]>();
  filteredUsers$: Observable<WithSearchString<User>[]>;

  filter$ = new Subject<any>();

  roles = userRoles.filter(item => item.assignable);

  @ViewChild('filterForm', { static: true }) filterForm!: NgForm;

  showFilter: boolean = false;

  search$ = new BehaviorSubject<string>("");

  paramsSubscription?: Subscription;

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

  }

  ngAfterViewInit() {
    this.filterForm.valueChanges!.pipe(debounceTime(250)).subscribe(this.filter$);
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

  async loadUsers() {
    const users = await this.api.get<User[]>("users", { members: 1 });

    this.users$.next(users.map(user => {
      const searchString = [
        user.login,
        user.member && user.member.nickname,
        user.member && user.member.name && user.member.name.first,
        user.member && user.member.name && user.member.name.last
      ].filter(item => !!item).join(" ");
      return { ...user, searchString };
    }));
  }

  filterUsers(filter: UsersFilter, users: WithSearchString<User>[]) {

    const search_re = filter.search ? new RegExp("(^| )" + filter.search.replace(/ /g, "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i") : undefined;

    return users.filter(user => {
      if (search_re && !search_re.test(user.searchString!)) return false;
      if (filter.role && filter.role.length && !filter.role.some(filterRole => user.roles.indexOf(filterRole) !== -1)) return false;

      return true;
    });
  }

  getRoleName(roleId: string) {
    return this.roles.find(item => item.id === roleId)?.title || roleId;
  }

}
