import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ConfigService } from "app/core/services/config.service";
import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/admin/services/toast.service";

import { Member } from "app/shared/schema/member";
import { WebConfigGroup } from "app/shared/schema/webconfig";
import { TitleService } from 'app/core/services/title.service';
import { MenuService } from 'app/core/services/menu.service';

@Component({
  selector: 'members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, OnDestroy {

  members: Member[] = [];

  groups: WebConfigGroup[] = [];
  roles: string[] = [];

  view: string;
  currentGroup: string;

  views: any = {
    "all": {},
    "group": { group: null }
  };

  @ViewChild("createMemberModal", { static: true }) createMemberModal: TemplateRef<any>;
  createMemberModalRef: BsModalRef;

  paramsSubscription: Subscription;

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private titleService: TitleService,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    this.loadConfig();

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {

      this.view = params.view || "all";
      this.currentGroup = params.group;
      this.views.group.group = params.group;

      this.loadMembers(params.view);
    });

    this.titleService.setPageTitle("Členská databáze");
    this.menuService.setActions([{
      type: "action", "label": "Přidat nového člena", callback: () => this.openCreateMemberModal()
    }])
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  loadConfig() {
    this.configService.getConfig().then(config => {
      this.groups = config.members.groups.filter(group => group.real);
      this.roles = config.members.roles.map(item => item.id);
    })
  }

  async loadMembers(view: string) {
    const options = Object.assign({ sort: "inactive group -role nickname" }, this.views[view] || {});
    this.members = await this.api.get<Member[]>("members", options);
  }

  openCreateMemberModal() {
    this.createMemberModalRef = this.modalService.show(this.createMemberModal);
  }

  async createMember(form: NgForm) {
    // get data from form
    const eventData = form.value;
    // create the event and wait for confirmation
    const response = await this.api.post("members", eventData);
    // get new member _id
    let member = await this.api.get<Member>(response.headers.get("location"), { select: "_id" });
    // close the modal
    this.createMemberModalRef.hide();
    // show the confrmation
    this.toastService.toast("Člen uložen.");
    // open the event
    this.router.navigate(["./", {}, member._id], { relativeTo: this.route });
  }

}
