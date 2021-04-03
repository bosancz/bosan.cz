import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'app/core/services/api.service';
import { ConfigService } from 'app/core/services/config.service';
import { ToastService } from 'app/core/services/toast.service';
import { Member } from 'app/schema/member';
import { WebConfigGroup } from 'app/schema/web-config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'members-edit',
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.scss']
})
export class MembersEditComponent {

  member?: Member;

  groups: WebConfigGroup[] = [];
  roles: string[] = [];
  membershipTypes: string[] = [];

  paramsSubscription?: Subscription;

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private configService: ConfigService
  ) {
    this.loadConfig();
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.loadMember(params["member"]);
    });
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

  loadConfig() {
    this.configService.getConfig().then(config => {
      this.groups = config.members.groups.filter(group => group.real);
      this.roles = config.members.roles.map(item => item.id);
      this.membershipTypes = config.members.membershipTypes.map(item => item.id);
    });
  }

  async loadMember(memberId: string) {
    this.member = await this.api.get<Member>(["member", memberId]);
  }


  async saveMember(memberData: any) {

    if (!this.member) return;

    // send the list of changes or current state of member to the server
    await this.api.patch(["member", this.member._id], memberData);

    await this.loadMember(this.member._id);

    // send a toast with OK message
    this.toastService.toast("Uloženo.");

    this.router.navigate(["../"], { relativeTo: this.route });
  }

}
