import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from "@angular/forms";

import { Event } from "../../../../../schema/event";

@Component({
  selector: 'event-admin-registration',
  templateUrl: './event-admin-registration.component.html',
  styleUrls: ['./event-admin-registration.component.scss']
})
export class EventAdminRegistrationComponent implements OnInit {

  @Input() event:Event;
  
  constructor() { }

  ngOnInit() {
  }
  
  uploadRegistration(form:NgForm){
    
  }

}
