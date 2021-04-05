import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";

import { Subject, Observable, combineLatest, ReplaySubject } from "rxjs";
import { map, debounceTime } from 'rxjs/operators';

import { ConfigService } from "app/core/services/config.service";
import { ApiService } from "app/core/services/api.service";

import { Member } from "app/schema/member";
import { WebConfigGroup, WebConfigMemberRole } from "app/schema/web-config";
import { DateTime } from 'luxon';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

type MemberWithSearchString = Member & { searchString: string; };

interface MemberFilter {
  search: string;
  groups: string[];
  roles: string[];
  activity: "active" | "inactive";
  fields: string[];
}

@Component({
  selector: 'members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, ViewWillEnter {

  members$ = new Subject<(MemberWithSearchString)[]>();
  filteredMembers$: Observable<Member[]>;

  filter$ = new Subject<MemberFilter>();

  showFilter: boolean = false;

  fields = [
    { id: "nickname", name: "Přezdívka" },
    { id: "group", name: "Oddíl" },
    { id: "role", name: "Role" },
    { id: "post", name: "Funkce" },
    { id: "rank", name: "Hodnost" },
    { id: "stars", name: "Hvězdy" },
    { id: "name", name: "Jméno" },
    { id: "birthday", name: "Datum narození" },
    { id: "age", name: "Věk" },
    { id: "email", name: "Email" },
    { id: "mobile", name: "Mobil" },
    { id: "city", name: "Město" },
  ];

  actions: Action[] = [
    {
      icon: "search-outline",
      pinned: true,
      handler: () => this.showFilter = !this.showFilter
    },
    {
      icon: "add-outline",
      pinned: true,
      handler: () => this.create()
    }
  ];

  visibleFields$ = new ReplaySubject<{ [field: string]: boolean; }>();

  defaultFields = ["nickname", "group", "role", "name", "birthday"];

  groups: WebConfigGroup[] = [];
  roles: WebConfigMemberRole[] = [];

  @ViewChild('filterForm', { static: true }) filterForm!: NgForm;

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.filteredMembers$ = combineLatest([this.members$, this.filter$])
      .pipe(map(([members, filter]) => this.filterMembers(filter, members)));

    this.filter$
      .pipe(map(filter => filter.fields.reduce((acc, cur) => (acc[cur] = true, acc), {} as { [field: string]: boolean; })))
      .subscribe(this.visibleFields$);

  }

  async ngOnInit() {
    await this.loadConfig();
  }

  ionViewWillEnter() {
    this.loadMembers();
  }

  ngAfterViewInit() {
    this.filterForm.valueChanges!.pipe(debounceTime(250)).subscribe(this.filter$);
  }

  getAge(birthday: string): number {
    return Math.floor((-1) * DateTime.fromISO(birthday).diffNow("years").years);
  }

  private async loadConfig() {
    const config = await this.configService.getConfig();
    this.groups = config.members.groups.filter(group => group.real);
    this.roles = config.members.roles;
  }

  private async loadMembers() {

    const members = (await this.api.get<Member[]>("members"))
      .map(member => {
        const searchString = [
          member.nickname,
          member.name && member.name.first,
          member.name && member.name.last,
          member.birthday ? DateTime.fromISO(member.birthday).year : undefined,
          member.contacts && member.contacts.email,
          member.contacts && member.contacts.mobile && member.contacts.mobile.replace(/[^0-9]/g, "").replace("+420", ""),
          member.address && member.address.city
        ].filter(item => !!item).join(" ");
        return { ...member, searchString };
      });

    this.sortMembers(members);

    this.members$.next(members);
  }

  private create() {
    this.router.navigate(["pridat"], { relativeTo: this.route });
  }

  private filterMembers(filter: MemberFilter, members: MemberWithSearchString[]) {

    console.log(filter);

    const search_re = filter.search ? new RegExp("(^| )" + filter.search.replace(/ /g, "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i") : undefined;

    return members.filter(member => {
      if (search_re && !search_re.test(member.searchString)) return false;
      if (filter.roles && filter.roles.length && filter.roles.indexOf(member.role) === -1) return false;
      if (filter.groups && filter.groups.length && filter.groups.indexOf(member.group) === -1) return false;
      if (filter.activity && filter.activity.length && filter.activity.indexOf(member.inactive ? "inactive" : "active") === -1) return false;

      return true;
    });
  }

  private sortMembers(members: Member[]): void {
    const groupIndex = this.groups.map(group => group.id);
    const roleIndex = this.roles.map(role => role.id);

    members.sort((a, b) => (
      (Number(a.inactive) - Number(b.inactive))
      || (a.group && b.group && groupIndex.indexOf(a.group) - groupIndex.indexOf(b.group))
      || (a.role && b.role && roleIndex.indexOf(a.role) - roleIndex.indexOf(b.role))
      || (a.nickname && b.nickname && a.nickname.localeCompare(b.nickname))
      || 0
    ));
  }


}
