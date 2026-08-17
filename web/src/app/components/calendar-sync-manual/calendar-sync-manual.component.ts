import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ApiService } from "app/services/api.service";

const FALLBACK_ICAL_URL = "https://interni.bosan.cz/api/public/program/ical";

@Component({
  selector: 'calendar-sync-manual',
  templateUrl: './calendar-sync-manual.component.html',
  styleUrls: ['./calendar-sync-manual.component.scss']
})
export class CalendarSyncManualComponent implements OnInit {

  title: string;
  closeBtnName: string;
  list: any[] = [];

  icalUrl: string = FALLBACK_ICAL_URL;

  constructor(
    public bsModalRef: BsModalRef,
    private api: ApiService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.icalUrl = await this.api.path2href("program:ical");
    } catch (err) {
      this.icalUrl = FALLBACK_ICAL_URL;
    }
  }

}
