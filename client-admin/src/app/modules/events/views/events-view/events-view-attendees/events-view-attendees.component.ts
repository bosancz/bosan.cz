import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ApiService } from 'app/core/services/api.service';
import { EventAddAttendeesComponent } from 'app/modules/events/components/event-add-attendees/event-add-attendees.component';
import { MemberSelectorModalComponent } from 'app/modules/events/components/member-selector-modal/member-selector-modal.component';
import { EventsService } from 'app/modules/events/services/events.service';
import { Event } from 'app/schema/event';
import { Member } from 'app/schema/member';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';

@UntilDestroy()
@Component({
  selector: 'bo-events-view-attendees',
  templateUrl: './events-view-attendees.component.html',
  styleUrls: ['./events-view-attendees.component.scss']
})
export class EventsViewAttendeesComponent implements OnInit {

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

  constructor(
    private eventsService: EventsService,
    private api: ApiService,
    public modalController: ModalController
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

  private sortAttendees() {
    this.attendees.sort((a, b) => {
      const aString = a.nickname || a.name?.first || a.name.last || "";
      const bString = b.nickname || b.name?.first || b.name.last || "";
      return aString.localeCompare(bString);
    });
  }

  async addAttendeeModal() {

    const members = await this.api.get("members");

    const modal = await this.modalController.create({
      component: MemberSelectorModalComponent,
      componentProps: { members }
    });

    modal.onDidDismiss().then(ev => {
      if (ev.data?.member) this.addAttendee(ev.data?.member);
    });

    return await modal.present();
  }

  private async addAttendee(member: Member) {
    if (!this.event) return;

    const attendees = this.event.attendees?.map(member => member._id) || [];
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


}
