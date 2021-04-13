import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventAddAttendeesComponent } from 'app/modules/events/components/event-add-attendees/event-add-attendees.component';
import { EventsService } from 'app/modules/events/services/events.service';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';

@Component({
  selector: 'bo-events-view-attendees',
  templateUrl: './events-view-attendees.component.html',
  styleUrls: ['./events-view-attendees.component.scss']
})
export class EventsViewAttendeesComponent implements OnInit {

  event = this.eventsService.event$;

  actions: Action[] = [
    {
      text: "Přidat",
      icon: "add-outline",
      pinned: true,
      handler: () => this.addAttendee()
    }
  ];

  constructor(
    private eventsService: EventsService,
    public modalController: ModalController
  ) { }

  ngOnInit(): void {
  }

  async addAttendee() {
    const modal = await this.modalController.create({
      component: EventAddAttendeesComponent,
    });
    return await modal.present();
  }


}
