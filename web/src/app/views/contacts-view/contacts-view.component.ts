import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/services/title.service";
import { ConfigService } from "app/services/config.service";

@Component({
  selector: 'contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.scss']
})
export class ContactsViewComponent implements OnInit {

  contacts:any = {};
  
  mapUrl:string;
  
  constructor(private titleService:TitleService, private configService:ConfigService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Kontakty");
    this.loadConfig();
  }

  loadConfig(){
    this.configService.getConfig().then(config => {
      this.contacts = config.contacts;
      this.mapUrl = config.general.homeMapUrl;
    });
  }

}
