import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberGroups } from 'app/config/member-groups';
import { MemberRoles } from 'app/config/member-roles';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { Member } from 'app/schema/member';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';



@Component({
  selector: 'members-create',
  templateUrl: './members-create.component.html',
  styleUrls: ['./members-create.component.scss']
})
export class MembersCreateComponent implements OnInit {

  groups = MemberGroups;
  roles = MemberRoles;

  actions: Action[] = [
    {
      "text": "Přidat",
      handler: () => this.create()
    }
  ];

  @ViewChild("createMemberForm") form!: NgForm;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() { }

  async create() {

    const formData = this.form.value;

    const response = await this.api.post("members", formData);
    this.toastService.toast("Člen uložen.");

    const location = response.headers.get("location");
    if (!location) {
      this.toastService.toast("Chyba při otevírání nového člena.");
      return;
    }

    let member = await this.api.get<Member>({ href: location }, { select: "_id" });

    this.router.navigate(["../", {}, member._id], { relativeTo: this.route, replaceUrl: true });
  }

}
