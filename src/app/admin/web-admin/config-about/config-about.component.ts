import { Component, OnInit, Input } from '@angular/core';

import { WebConfig } from "../../../schema/webconfig";

@Component({
  selector: 'config-about',
  templateUrl: './config-about.component.html',
  styleUrls: ['./config-about.component.css']
})
export class ConfigAboutComponent implements OnInit {

  @Input()
  config:WebConfig;
  
  constructor() { }

  ngOnInit() {
  }

}
