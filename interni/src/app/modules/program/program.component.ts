import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { DateTime } from 'luxon';
import { ProgramService } from './services/program.service';

@Component({
  selector: 'bo-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit, ViewWillEnter {

  pendingEventsCount?: number;

  constructor(
    public programService: ProgramService
  ) { }

  ngOnInit(): void {
  }

  ionViewWillEnter() {
    this.programService.loadEventsCount();
  }


}
