import { Component, Input } from '@angular/core';

import { Contact } from "app/core/schema/contact";

@Component({
  selector: 'contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss']
})
export class ContactCardComponent {

  @Input()
  contacts:Contact[];
  
  constructor() { }

}
