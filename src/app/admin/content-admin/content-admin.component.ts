import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/services/title.service";

@Component({
  selector: 'content-admin',
  templateUrl: 'content-admin.component.html',
  styleUrls: ['content-admin.component.css']
})
export class ContentAdminComponent implements OnInit {

  constructor(private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setTitle("Interní sekce");
  }

}
