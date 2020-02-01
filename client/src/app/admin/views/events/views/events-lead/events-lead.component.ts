import { Component, OnInit } from '@angular/core';
import { ToastService } from 'app/admin/services/toast.service';
import { ApiService } from 'app/core/services/api.service';
import { Event } from 'app/shared/schema/event';
import { Router } from '@angular/router';

@Component({
  selector: 'events-lead',
  templateUrl: './events-lead.component.html',
  styleUrls: ['./events-lead.component.scss']
})
export class EventsLeadComponent implements OnInit {

  title = "Vést akci";

  events: Event[];

  constructor(
    private api: ApiService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    this.events = await this.api.get<Event[]>("events:noleader", { sort: "dateFrom" });
  }

  async leadEvent(event: Event) {
    await this.api.post(event._actions.lead);
    this.loadEvents();
    const toastRef = this.toastService.toast("Po náročném výběrovém řízení jsi byl/a zvolen/a vedoucím této akce.", "Otevřít akci");
    toastRef.onAction().subscribe(() => this.router.navigate(["/interni/akce/" + event._id]));
  }

}
