import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { Event } from 'app/schema/event';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { EventsService } from '../../services/events.service';



@Component({
  selector: 'event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {

  event?: Event;

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
    private router: Router
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
  }

  async saveEvent() {

    if (!this.event) return;

    const eventData = this.form.value;

    await this.api.patch<Event>(["event", this.event._id], eventData);
    this.toastService.toast("Uloženo.");

    this.router.navigate(["../info"], { relativeTo: this.route, replaceUrl: true });
  }

}
