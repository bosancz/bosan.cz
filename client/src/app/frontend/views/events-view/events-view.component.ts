import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/core/services/title.service";
import { ConfigService } from "app/core/services/config.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent implements OnInit {

  public canalFormUrl:Observable<string> = this.configService.config.pipe(map(config => config.canal.formUrl));
  public canalAttendeesUrl:Observable<string> = this.configService.config.pipe(map(config => config.canal.attendeesUrl));

  constructor(private titleService:TitleService,private configService:ConfigService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Program");
  }
}
