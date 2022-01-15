import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bo-dot',
  templateUrl: './dot.component.html',
  styleUrls: ['./dot.component.scss'],
  host: {
    "[style.background-color]": "color"
  }
})
export class DotComponent implements OnInit {

  @Input() color: string = "#000";

  constructor() { }

  ngOnInit(): void {
  }

}
