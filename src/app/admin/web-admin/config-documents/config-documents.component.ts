import { Component, OnInit, Input } from '@angular/core';

import { WebConfig } from "../../../schema/webconfig";

@Component({
  selector: 'config-documents',
  templateUrl: './config-documents.component.html',
  styleUrls: ['./config-documents.component.css']
})
export class ConfigDocumentsComponent implements OnInit {

  @Input()
  config:WebConfig;

  constructor() {}

  ngOnInit() {
    
    if(!this.config.documents) this.config.documents = {url:""};
  }

}
