import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/services/title.service";

import { Contacts } from "config/contacts";
import { General } from "config/general";

@Component({
  selector: 'contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.scss']
})
export class ContactsViewComponent implements OnInit {

  contacts:any = Contacts;

  mapUrl:string = General.homeMapUrl;

  constructor(private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Kontakty");
  }

}
