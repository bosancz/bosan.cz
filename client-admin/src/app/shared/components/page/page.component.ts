import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bo-page',
  template: `<ng-content></ng-content>`,
  host: {
    "class": "d-block",
    "[class.my-3]": "!noPadding",
    "[class.px-3]": "!noPadding",
    "[class.px-lg-5]": "!noPadding",
  }
})
export class PageComponent implements OnInit {

  @Input() noPadding = false;

  constructor() { }

  ngOnInit() {
  }

}
