import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/core/services/title.service";

@Component({
  selector: 'news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.scss']
})
export class NewsViewComponent implements OnInit {

  constructor(private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Aktuálně");
  }

}
