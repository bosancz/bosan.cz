import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { DataService } from "app/services/data.service";

@Component({
  selector: 'documents-view',
  templateUrl: './documents-view.component.html',
  styleUrls: ['./documents-view.component.css']
})
export class DocumentsViewComponent implements OnInit {

  loaded:boolean = false;
  
  url:SafeResourceUrl;
  
  constructor(private domSanitizer:DomSanitizer, private cd:ChangeDetectorRef, private dataService:DataService) {
  }

  ngOnInit() {    
    this.dataService.getConfig().then(config => {
      this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(config.general.documentsUrl);
    });
  }

}
