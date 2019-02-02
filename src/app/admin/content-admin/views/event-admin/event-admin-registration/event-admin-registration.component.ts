import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { ToastService } from "app/core/services/toast.service";
import { ApiService } from "app/core/services/api.service";

import { Event } from "app/core/schema/event";

@Component({
  selector: 'event-admin-registration',
  templateUrl: './event-admin-registration.component.html',
  styleUrls: ['./event-admin-registration.component.scss']
})
export class EventAdminRegistrationComponent {

  @Input() event:Event;
  
  @Output() saved:EventEmitter<void> = new EventEmitter();
  
  constructor(private api:ApiService, private toastService:ToastService) { }
  
  getRegistrationUrl(event:Event):string{
    return this.api.link2href(event._links.registration);
  }

  async uploadRegistration(photoInput:HTMLInputElement){
    
    if(!photoInput.files.length) return;
    
    let file = photoInput.files[0];

    if(file.name.split(".").pop().toLowerCase() !== "pdf"){
      this.toastService.toast("Soubor musí být ve formátu PDF");
      return;
    }

    let formData:FormData = new FormData();

    formData.set("file",file,file.name);

    await this.api.post(this.event._links.registration,formData);
    
    this.saved.emit();
    
    this.toastService.toast("Přihláška nahrána.");
  }
  
  async deleteRegistration(){
    await this.api.delete(this.event._links.registration);
    
    this.saved.emit();
    
    this.toastService.toast("Přihláška smazána.");
  }
  
}
