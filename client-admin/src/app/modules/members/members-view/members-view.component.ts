import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from "app/core/services/toast.service";
import { Member } from "app/schema/member";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { Subject } from "rxjs";
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';



@Component({
  selector: 'members-view',
  templateUrl: './members-view.component.html',
  styleUrls: ['./members-view.component.scss']
})
export class MembersViewComponent implements OnInit, ViewWillEnter {

  member?: Member;

  actions: Action[] = [
    {
      text: "Upravit",
      pinned: true,
      icon: "create-outline",
      handler: () => this.router.navigate(["upravit"], { relativeTo: this.route })
    },
    {
      text: "Smazat",
      role: "destructive",
      color: "danger",
      handler: () => this.delete()
    }
  ];

  // <button mat-button color="primary" [disabled]="!member?._links?.self?.allowed?.PATCH" routerLink="upravit">
  //         Upravit
  //       </button>
  //       <button
  //         mat-button
  //         color="warn"
  //         [disabled]="!member?._links?.self?.allowed?.DELETE"
  //         (click)="deleteMember(member)"
  //       >
  //         Smazat
  //       </button>

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController
  ) {

  }

  ngOnInit() {
    this.route.params
      .pipe(map((params: Params) => params.member))
      .subscribe(memberId => this.load(memberId));
  }

  ionViewWillEnter() { }

  // DB interaction
  async load(memberId: string) {
    this.member = await this.api.get<Member>(["member", memberId]);
  }

  async delete() {
    if (!this.member) return;

    const alert = await this.alertController.create({
      header: 'Smazat člena?',
      message: `Opravdu chcete smazat člena „<strong>${this.getFullName(this.member)}</strong>“?`,
      buttons: [
        { text: 'Zrušit' },
        { text: 'Smazat', handler: () => this.deleteConfirmed() }
      ]
    });

    await alert.present();
  }

  async deleteConfirmed() {

    if (!this.member) return;

    await this.api.delete(["member", this.member._id]);

    this.toastService.toast(`Člen ${this.member?.nickname} smazán.`);

    this.router.navigate(["../"], { relativeTo: this.route, replaceUrl: true });
  }

  getFullName(member?: Member) {
    if (!member) return "";
    return member.nickname + (member?.name ? ` (${member?.name?.first} ${member?.name?.last})` : '');
  }
}
