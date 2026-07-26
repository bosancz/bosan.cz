import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/services/title.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CalendarSyncManualComponent } from "app/components/calendar-sync-manual/calendar-sync-manual.component";

import { General } from "config/general";

@Component({
  selector: 'events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent implements OnInit {

  public canalFormUrl: string = General.canalFormUrl;
  public canalAttendeesUrl: string = General.canalAttendeesUrl;

  IcalManualRef:BsModalRef;

  constructor(private titleService: TitleService, private IcalManualService: BsModalService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Program");
  }

  OpenManualForIcal(){
    this.IcalManualRef = this.IcalManualService.show(CalendarSyncManualComponent, Object.assign({}, { class: 'gray modal-lg' }));
  }
}