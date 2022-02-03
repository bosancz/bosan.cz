import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { MemberGroups } from 'app/config/member-groups';
import { MemberRoles } from 'app/config/member-roles';
import { ApiService } from "app/core/services/api.service";
import { ToastService } from 'app/core/services/toast.service';
import { Member } from "app/schema/member";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { DateTime } from 'luxon';
import { combineLatest, Observable, ReplaySubject, Subject } from "rxjs";
import { debounceTime, map } from 'rxjs/operators';


type MemberWithSearchString = Member & { searchString: string; };

interface TableFilter {
  search?: string;
  groups?: string[];
  roles?: string[];
  activity?: "active" | "inactive";
  fields?: Fields[];
}

enum Fields {
  "nickname" = "nickname",
  "group" = "group",
  "role" = "role",
  "post" = "post",
  "rank" = "rank",
  "stars" = "stars",
  "name" = "name",
  "birthday" = "birthday",
  "age" = "age",
  "email" = "email",
  "mobile" = "mobile",
  "city" = "city",
}

interface FieldData {
  name: string;
  visible: boolean;
}

interface TableRow {
  member: Member,
  fields: { [field in Fields]?: string; };
}

@Component({
  selector: 'members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, ViewWillEnter {

  members?: MemberWithSearchString[];
  filteredMembers: Member[] = [];

  tableData: TableRow[] = [];

  filter: TableFilter = {
    activity: "active",
    fields: [Fields.nickname, Fields.group, Fields.role, Fields.name, Fields.birthday]
  };

  showFilter: boolean = false;

  fields: { [field in Fields]: FieldData } = {
    "nickname": { name: "Přezdívka", visible: true },
    "group": { name: "Oddíl", visible: true },
    "role": { name: "Role", visible: true },
    "post": { name: "Funkce", visible: false },
    "rank": { name: "Hodnost", visible: false },
    "stars": { name: "Hvězdy", visible: false },
    "name": { name: "Jméno", visible: true },
    "birthday": { name: "Datum narození", visible: true },
    "age": { name: "Věk", visible: false },
    "email": { name: "Email", visible: false },
    "mobile": { name: "Mobil", visible: false },
    "city": { name: "Město", visible: false },
  };

  actions: Action[] = [
    {
      icon: "add-outline",
      pinned: true,
      handler: () => this.create()
    }
  ];

  groups = MemberGroups;
  roles = MemberRoles;

  @ViewChild('filterForm', { static: true }) filterForm?: NgForm;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private toasts: ToastService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadMembers();
  }

  ngAfterViewInit() {
    this.filterForm!.valueChanges!.pipe(debounceTime(250)).subscribe(filter => this.updateTable(filter));
  }

  getAge(birthday: string): number {
    return Math.floor((-1) * DateTime.fromISO(birthday).diffNow("years").years);
  }

  copyRow(member: Member) {

    const values: string[] = [];
    if (this.fields.nickname.visible) values.push(member.nickname || "");
    if (this.fields.group.visible) values.push(member.group);
    if (this.fields.role.visible) values.push(member.role);
    if (this.fields.post.visible) values.push(member.post);
    if (this.fields.rank.visible) values.push(member.rank);
    if (this.fields.stars.visible) values.push(member.stars);
    if (this.fields.name.visible) values.push(`${member.name?.first} ${member.name?.last}`);
    if (this.fields.birthday.visible) values.push(this.datePipe.transform(member.birthday, "d. M. y") || "");
    if (this.fields.age.visible) values.push(member.birthday ? this.getAge(member.birthday).toFixed(0) : "");
    if (this.fields.email.visible) values.push(member.contacts?.email || "");
    if (this.fields.mobile.visible) values.push(member.contacts?.mobile || "");
    if (this.fields.city.visible) values.push(member.address?.city || "");

    const data = values.join("\t");
    navigator.clipboard.writeText(data);

    this.toasts.toast("Zkopírováno do schránky.");
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

    this.members = members;

    this.updateTable(this.filterForm?.value);
  }

  private create() {
    this.router.navigate(["pridat"], { relativeTo: this.route });
  }

  private updateTable(filter: TableFilter) {

    if (!this.members) {
      this.tableData = [];
      return;
    }

    const search_re = filter.search ? new RegExp("(^| )" + filter.search.replace(/ /g, "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i") : undefined;

    this.filteredMembers = this.members
      .filter(member => {
        if (search_re && !search_re.test(member.searchString)) return false;
        if (filter.roles && filter.roles.length && filter.roles.indexOf(member.role) === -1) return false;
        if (filter.groups && filter.groups.length && filter.groups.indexOf(member.group) === -1) return false;
        if (filter.activity && filter.activity.length && filter.activity.indexOf(member.inactive ? "inactive" : "active") === -1) return false;

        return true;
      });

    Object.keys(this.fields).forEach((key: any) => {
      this.fields[key as Fields].visible = filter.fields?.indexOf(key) !== -1;
    });
  }

  private sortMembers(members: Member[]): void {
    const groupIndex = Object.keys(this.groups);
    const roleIndex = Object.keys(this.roles);

    members.sort((a, b) => (
      (Number(a.inactive) - Number(b.inactive))
      || (a.group && b.group && groupIndex.indexOf(a.group) - groupIndex.indexOf(b.group))
      || (a.role && b.role && roleIndex.indexOf(a.role) - roleIndex.indexOf(b.role))
      || (a.nickname && b.nickname && a.nickname.localeCompare(b.nickname))
      || 0
    ));
  }


}
