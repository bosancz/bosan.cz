import { Component } from '@angular/core';
import { Member } from 'app/shared/schema/member';
import { Observable, from } from 'rxjs';
import { ApiService } from 'app/services/api.service';
import { ToastService } from 'app/services/toast.service';
import { ActivatedRoute, Params } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { WebConfigGroup } from 'app/shared/schema/web-config';
import { ConfigService } from 'app/services/config.service';

@Component({
  selector: 'members-edit',
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.scss']
})
export class MembersEditComponent {

  member$: Observable<Member> = this.route.params
    .pipe(map((params: Params) => params.member))
    .pipe(mergeMap(memberId => from(this.loadMember(memberId))));

  groups: WebConfigGroup[] = [];
  roles: string[] = [];
  membershipTypes: string[] = [];

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private configService: ConfigService
  ) {
    this.loadConfig();
  }

  loadConfig() {
    this.configService.getConfig().then(config => {
      this.groups = config.members.groups.filter(group => group.real);
      this.roles = config.members.roles.map(item => item.id);
      this.membershipTypes = config.members.membershipTypes.map(item => item.id);
    });
  }

  async loadMember(memberId: string) {
    return this.api.get<Member>(["member", memberId]);
  }


  async saveMember(memberData: any) {
    // send the list of changes or current state of member to the server
    await this.api.patch(["member", memberData._id], memberData);

    // send a toast with OK message
    this.toastService.toast("Uloženo.");
  }

}
