import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/services/title.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CalendarSyncManualComponent } from "app/components/calendar-sync-manual/calendar-sync-manual.component";

@Component({
  selector: 'events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent implements OnInit {

  public canalFormUrl: string = "https://docs.google.com/forms/d/e/1FAIpQLSe4ofwhrbqfCZxRVPTfHg939WXMTIMO7ioY-PP8ATLzdsHeYA/viewform?usp=sf_link";
  public canalAttendeesUrl: string = "https://docs.google.com/spreadsheets/d/1xT0_pBiN2xG6xmc3m0smrCnc1XRgXV8kePeuSW-eJcQ/edit?usp=sharing";

  IcalManualRef:BsModalRef;

  constructor(private titleService: TitleService, private IcalManualService: BsModalService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Program");
  }

  OpenManualForIcal(){
    this.IcalManualRef = this.IcalManualService.show(CalendarSyncManualComponent, Object.assign({}, { class: 'gray modal-lg' }));
  }
}