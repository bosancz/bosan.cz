import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  host: {
    "class": "header-container d-none d-lg-flex mt-5 mb-4"
  }
})
export class PageHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
