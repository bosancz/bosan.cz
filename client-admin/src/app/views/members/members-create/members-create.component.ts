import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';
import { WebConfigGroup, WebConfigMemberRole } from 'app/shared/schema/web-config';
import { ConfigService } from 'app/services/config.service';

import { Member } from 'app/shared/schema/member';

@Component({
  selector: 'members-create',
  templateUrl: './members-create.component.html',
  styleUrls: ['./members-create.component.scss']
})
export class MembersCreateComponent implements OnInit {

  groups?: WebConfigGroup[];
  roles?: WebConfigMemberRole[];

  constructor(
    private api: ApiService,
    private configService: ConfigService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadConfig();
  }

  async loadConfig() {
    const config = await this.configService.getConfig();
    this.groups = config.members.groups.filter(group => group.real && group.active);
    this.roles = config.members.roles;
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
    this.router.navigate(["../", {}, member._id], { relativeTo: this.route });
  }

}
