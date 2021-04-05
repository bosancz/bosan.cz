import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from "app/core/services/toast.service";
import { Member } from "app/schema/member";
import { Subject } from "rxjs";
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';



@Component({
  selector: 'members-view',
  templateUrl: './members-view.component.html',
  styleUrls: ['./members-view.component.scss']
})
export class MembersViewComponent implements OnInit {

  member$ = new Subject<Member>();

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params
      .pipe(map((params: Params) => params.member))
      .pipe(distinctUntilChanged())
      .pipe(mergeMap(memberId => this.loadMember(memberId)))
      .subscribe(this.member$);

  }

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
