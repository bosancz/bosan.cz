import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'calendar-sync-manual',
  templateUrl: './calendar-sync-manual.component.html',
  styleUrls: ['./calendar-sync-manual.component.scss']
})
export class CalendarSyncManualComponent implements OnInit {
  
  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

}
