import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { from, Observable, Subject } from "rxjs";

import { ToastService } from "app/services/toast.service";

import { Member } from "app/shared/schema/member";
import { ApiService } from 'app/services/api.service';
import { map, mergeMap, distinctUntilChanged, tap, switchMap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'members-view',
  templateUrl: './members-view.component.html',
  styleUrls: ['./members-view.component.scss']
})
export class MembersViewComponent implements OnInit {

  member$ = new Subject();


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
      .subscribe(this.member$)
    
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
