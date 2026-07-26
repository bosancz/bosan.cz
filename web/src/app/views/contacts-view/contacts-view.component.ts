import { Component, OnInit } from '@angular/core';

import { TitleService } from "app/services/title.service";

@Component({
  selector: 'contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.scss']
})
export class ContactsViewComponent implements OnInit {

  mapUrl:string = "https://frame.mapy.cz/s/cefoluseru";

  constructor(private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setPageTitle("Kontakty");
  }

}
