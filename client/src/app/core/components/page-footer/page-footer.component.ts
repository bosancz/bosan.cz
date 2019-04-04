import { Component, OnInit } from '@angular/core';

import { LayoutService } from "app/core/services/layout.service";

@Component({
  selector: 'page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss']
})
export class PageFooterComponent implements OnInit {

  constructor(public layoutService:LayoutService) { }

  ngOnInit() {
  }

}
