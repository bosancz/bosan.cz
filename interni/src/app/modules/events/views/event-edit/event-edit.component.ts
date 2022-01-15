import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { Event } from 'app/schema/event';
import { Member } from 'app/schema/member';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { EventsService } from '../../services/events.service';



@Component({
  selector: 'event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {

  event?: Event;

  members: Member[] = [];

  actions: Action[] = [
    {
      text: "Uložit",
      handler: () => this.saveEvent()
    }
  ];

  @ViewChild("eventForm") form!: NgForm;

  constructor(
    private eventsService: EventsService,
    private api: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.eventsService.event$
      .subscribe(event => {
        this.event = event;
        if (this.event && !this.event.meeting) this.event.meeting = {};
      });

    this.route.params.subscribe(params => {
      this.eventsService.loadEvent(params["event"]);
    });

    this.loadMembers();
  }

  private async loadMembers() {
    const options = {
      select: "_id nickname name group",
    };

    this.members = await this.api.get<Member[]>("members", options);
  }

  async saveEvent() {

    if (!this.event) return;

    const eventData: Partial<Event> = this.form.value;

    // prevent switched date order
    if (eventData.dateFrom && eventData.dateTill) {
      const dates = [eventData.dateFrom, eventData.dateTill];
      dates.sort();
      eventData.dateFrom = dates[0];
      eventData.dateTill = dates[1];
    }

    // eventData.leaders = eventData.leaders?.map(member => member._id) || [];

    await this.api.patch<Event>(["event", this.event._id], eventData);
    this.toastService.toast("Uloženo.");

    // this.router.navigate(["../info"], { relativeTo: this.route, replaceUrl: true });
    this.navController.navigateBack(["/akce", this.event._id]);
  }

}
