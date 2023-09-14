import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/services/title.service";
import { ConfigService } from "app/services/config.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CalendarSyncManualComponent } from "app/components/calendar-sync-manual/calendar-sync-manual.component";

@Component({
  selector: 'events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent implements OnInit {

  public canalFormUrl: Observable<string> = this.configService.config.pipe(map(config => config.general.canalFormUrl));
  public canalAttendeesUrl: Observable<string> = this.configService.config.pipe(map(config => config.general.canalAttendeesUrl));

  IcalManualRef:BsModalRef;

  constructor(private titleService: TitleService, private configService: ConfigService, private IcalManualService: BsModalService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Program");
  }

  OpenManualForIcal(){
    this.IcalManualRef = this.IcalManualService.show(CalendarSyncManualComponent, Object.assign({}, { class: 'gray modal-lg' }));
  }
}