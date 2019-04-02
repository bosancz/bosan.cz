import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/core/services/title.service";
import { ConfigService } from "app/core/services/config.service";

@Component({
  selector: 'events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent implements OnInit {

  constructor(private titleService:TitleService,private configService:ConfigService) { }

  canalFormUrl:String;
  canalAttendeesUrl:String;

  ngOnInit() {
    this.titleService.setTitle("Program");
    this.loadConfig();
  }

    private loadConfig() {
        this.configService.getConfig().then(config => {
            this.canalFormUrl = config.canal.formUrl;
            this.canalAttendeesUrl = config.canal.attendeesUrl;
        });
    }
}
