import { Component, OnInit } from '@angular/core';

import { TitleService } from "../services/title.service";

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setTitle("Interní sekce");
  }

}
