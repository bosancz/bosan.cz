import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription, Subject, Observable, combineLatest } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ConfigService } from "app/core/services/config.service";
import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/admin/services/toast.service";

import { Member } from "app/shared/schema/member";
import { WebConfigGroup, WebConfigMemberRole } from "app/shared/schema/webconfig";
import { TitleService } from 'app/core/services/title.service';
import { MenuService } from 'app/core/services/menu.service';
import { map, debounceTime, tap } from 'rxjs/operators';

type MemberWithSearchString = Member & { searchString?: string };

@Component({
  selector: 'members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

  members$ = new Subject<(MemberWithSearchString)[]>();
  filteredMembers$: Observable<Member[]>;

  filter$ = new Subject<any>();

  groups: WebConfigGroup[] = [];
  roles: WebConfigMemberRole[] = [];

  @ViewChild('filterForm', { static: true }) filterForm: NgForm;

  search$ = new Subject<string>();

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.filteredMembers$ = combineLatest([this.members$, this.filter$])
      .pipe(map(([members, filter]) => this.filterMembers(filter, members)));

  }

  async ngOnInit() {
    await this.loadConfig();
    this.loadMembers();
  }

  ngAfterViewInit() {
    this.filterForm.valueChanges.pipe(debounceTime(250)).subscribe(this.filter$);
  }

  async loadConfig() {
    const config = await this.configService.getConfig();
    this.groups = config.members.groups.filter(group => group.real);
    this.roles = config.members.roles;
  }

  async loadMembers() {
    const members: MemberWithSearchString[] = (await this.api.get<Member[]>("members"))

    members.forEach(member => {
      member.searchString = [
        member.nickname,
        member.name ? Object.values(member.name).join(" ") : "",
        member.address ? Object.values(member.address).join(" ") : ""
      ].filter(item => !!item).join(" ")
    })

    console.log(members.filter(member => member.nickname==="Sam"));

    this.sortMembers(members);

    this.members$.next(members);
  }

  filterMembers(filter: any, members: MemberWithSearchString[]) {
    return members.filter(member => {
      if (filter.search) {
        const search_re = new RegExp("(^| )" + filter.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i")
        if(!search_re.test(member.searchString)) return false;
      }
      if (filter.role && filter.role.length && filter.role.indexOf(member.role) === -1) return false;
      if (filter.group && filter.group.length && filter.group.indexOf(member.group) === -1) return false;
      if (filter.activity && filter.activity.length && filter.activity.indexOf(member.inactive ? "inactive" : "active") === -1) return false;

      return true;
    });
  }

  sortMembers(members: Member[]): void {
    const groupIndex = this.groups.map(group => group.id);
    const roleIndex = this.roles.map(role => role.id);

    members.sort((a, b) => (
      (Number(a.inactive) - Number(b.inactive))
      || (a.group && b.group && groupIndex.indexOf(a.group) - groupIndex.indexOf(b.group))
      || (a.role && b.role && roleIndex.indexOf(a.role) - roleIndex.indexOf(b.role))
      || (a.nickname && b.nickname && a.nickname.localeCompare(b.nickname))
    ));
  }

  async createMember(form: NgForm) {
    // get data from form
    const eventData = form.value;
    // create the event and wait for confirmation
    const response = await this.api.post("members", eventData);
    // get new member _id
    let member = await this.api.get<Member>(response.headers.get("location"), { select: "_id" });
    // close the modal
    this.toastService.toast("Člen uložen.");
    // open the event
    this.router.navigate(["./", {}, member._id], { relativeTo: this.route });
  }

}
