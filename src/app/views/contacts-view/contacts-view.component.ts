import { Component, OnInit } from '@angular/core';

import { TitleService } from "../../services/title.service";
import { DataService } from "../../services/data.service";

import { Contact } from "../../schema/contact";

@Component({
  selector: 'contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css']
})
export class ContactsViewComponent implements OnInit {

  contacts:Contact[] = [];
  
  constructor(private titleService:TitleService, private dataService:DataService) { }

  ngOnInit() {
    this.titleService.setTitle("Kontakty");
    this.loadContacts();
  }

  async loadContacts(){
    let config = await this.dataService.getConfig();
    this.contacts = config.about.contacts;
  }

}
