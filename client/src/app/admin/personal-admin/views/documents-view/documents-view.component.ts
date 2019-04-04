import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { ConfigService } from "app/core/services/config.service";

@Component({
  selector: 'documents-view',
  templateUrl: './documents-view.component.html',
  styleUrls: ['./documents-view.component.css']
})
export class DocumentsViewComponent implements OnInit {

  loaded:boolean = false;
  
  url:SafeResourceUrl;
  
  constructor(private domSanitizer:DomSanitizer, private cd:ChangeDetectorRef, private configService:ConfigService) {
  }

  ngOnInit() {    
    this.configService.getConfig().then(config => {
      this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(config.general.documentsUrl);
    });
  }

}
