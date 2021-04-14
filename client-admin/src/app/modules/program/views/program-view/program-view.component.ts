import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EventsService } from 'app/modules/events/services/events.service';
import { Event } from 'app/schema/event';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { ProgramPrintComponent } from '../../components/program-print/program-print.component';
import { TrimesterDateRange } from '../../components/trimester-selector/trimester-selector.component';

@Component({
  selector: 'bo-program-view',
  templateUrl: './program-view.component.html',
  styleUrls: ['./program-view.component.scss']
})
export class ProgramViewComponent implements OnInit, OnDestroy {

  dateFrom?: string;
  dateTill?: string;

  calendarEvents: Event[] = [];

  showFilter: boolean = false;

  actions: Action[] = [
    {
      text: "Vybrat trimestr",
      icon: "calendar-outline",
      pinned: true,
      handler: () => this.showFilter = !this.showFilter
    },
    {
      text: "Tisk",
      handler: () => this.openPrintModal()
    },
    {
      text: "Plánování akcí",
      handler: () => this.router.navigate(["/program/planovani"])
    },
    {
      text: "Schvalování",
      handler: () => this.router.navigate(["/program/schvalovani"])
    },
  ];

  modal?: HTMLIonModalElement;

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.dateFrom = params["from"];
      this.dateTill = params["till"];
      if (this.dateFrom && this.dateTill) {
        this.loadCalendarEvents(this.dateFrom, this.dateTill);
      }
    });
  }

  ngOnDestroy() {
    this.modal?.dismiss();
  }

  setTrimester(dateRange: TrimesterDateRange) {
    const queryParams = {
      from: dateRange[0],
      till: dateRange[1],
    };
    this.router.navigate(["./"], { queryParams, replaceUrl: true, relativeTo: this.route });
  }

  async loadCalendarEvents(dateFrom: string, dateTill: string) {

    const options: any = {
      sort: "dateFrom",
      filter: {
        dateTill: { $gte: dateFrom },
        dateFrom: { $lte: dateTill }
      }
    };

    this.calendarEvents = await this.eventsService.listEvents(options);
  }

  private async openPrintModal() {
    this.modal = await this.modalController.create({
      component: ProgramPrintComponent
    });

    this.modal.present();
  }
}
