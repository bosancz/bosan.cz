import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { from, Observable } from "rxjs";

import { ToastService } from "app/admin/services/toast.service";

import { Member } from "app/shared/schema/member";
import { ApiService } from 'app/core/services/api.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'members-view',
  templateUrl: './members-view.component.html',
  styleUrls: ['./members-view.component.scss']
})
export class MembersViewComponent implements OnInit {

  member$: Observable<Member> = this.route.params
    .pipe(map((params: Params) => params.member))
    .pipe(mergeMap(memberId => from(this.loadMember(memberId))));


  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // DB interaction
  async loadMember(memberId: string) {
    return this.api.get<Member>(["member", memberId]);
  }

  async deleteMember(member: Member) {

    const confirmation = window.confirm(member.nickname ? `Opravdu smazat člena ${member.nickname}?` : `Opravdu smazat tohoto člena?`);

    if (!confirmation) return;

    await this.api.delete(["member", member._id]);
    
    this.toastService.toast("Člen smazán.");
    this.router.navigate(["../../"], { relativeTo: this.route });
  }

}
