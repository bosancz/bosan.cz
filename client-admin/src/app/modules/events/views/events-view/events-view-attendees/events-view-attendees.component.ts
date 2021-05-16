import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { EventAddAttendeesComponent } from 'app/modules/events/components/event-add-attendees/event-add-attendees.component';
import { MemberSelectorModalComponent } from 'app/modules/events/components/member-selector-modal/member-selector-modal.component';
import { EventsService } from 'app/modules/events/services/events.service';
import { Event } from 'app/schema/event';
import { Member } from 'app/schema/member';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { ThemeService } from 'ng2-charts';

@UntilDestroy()
@Component({
  selector: 'bo-events-view-attendees',
  templateUrl: './events-view-attendees.component.html',
  styleUrls: ['./events-view-attendees.component.scss']
})
export class EventsViewAttendeesComponent implements OnInit, OnDestroy {

  event?: Event;

  attendees: Member[] = [];

  actions: Action[] = [
    {
      text: "Přidat",
      icon: "add-outline",
      pinned: true,
      handler: () => this.addAttendeeModal()
    }
  ];

  modal?: HTMLIonModalElement;

  constructor(
    private eventsService: EventsService,
    private api: ApiService,
    public modalController: ModalController,
    private toasts: ToastService
  ) { }

  ngOnInit(): void {
    this.eventsService.event$
      .pipe(untilDestroyed(this))
      .subscribe(event => {
        this.event = event;
        this.attendees = event?.attendees || [];

        this.sortAttendees();
      });
  }

  ngOnDestroy() {
    this.modal?.dismiss();
  }

  private sortAttendees() {
    this.attendees.sort((a, b) => {
      const aString = a.nickname || a.name?.first || a.name.last || "";
      const bString = b.nickname || b.name?.first || b.name.last || "";
      return aString.localeCompare(bString);
    });
  }

  async addAttendeeModal() {

    const members = await this.api.get("members");

    this.modal = await this.modalController.create({
      component: MemberSelectorModalComponent,
      componentProps: { members }
    });

    this.modal.onDidDismiss().then(ev => {
      if (ev.data?.member) this.addAttendee(ev.data?.member);
    });

    return await this.modal.present();
  }

  private async addAttendee(member: Member) {
    if (!this.event) return;

    const attendees = this.event.attendees?.map(member => member._id) || [];

    if (attendees.findIndex(item => item === member._id) !== -1) {
      this.toasts.toast("Účastník už v seznamu je.");
      return;
    }

    attendees.push(member._id);

    await this.api.patch(["event", this.event._id], { attendees });

    await this.eventsService.loadEvent(this.event._id);

  }

  async removeAttendee(member: Member) {
    if (!this.event) return;

    let attendees = this.event.attendees?.map(member => member._id) || [];
    attendees = attendees.filter(item => item !== member._id);

    await this.api.patch(["event", this.event._id], { attendees });

    await this.eventsService.loadEvent(this.event._id);

  }

  toggleSliding(sliding: any) {
    sliding.getOpenAmount().then((open: number) => {
      if (open) sliding.close();
      else sliding.open();
    });
  }


}
