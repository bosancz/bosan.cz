import { Component, OnInit } from '@angular/core';

import { TitleService } from "../../services/title.service";

@Component({
  selector: 'events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent implements OnInit {

  constructor(private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setTitle("Program");
  }

}
