import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";

import { ToastService } from "app/services/toast.service";
import { DataService } from "app/services/data.service";

import { Event } from "app/schema/event";

@Component({
  selector: 'event-admin-registration',
  templateUrl: './event-admin-registration.component.html',
  styleUrls: ['./event-admin-registration.component.scss']
})
export class EventAdminRegistrationComponent {

  @Input() event:Event;
  
  @Output() saved:EventEmitter<void> = new EventEmitter();
  
  constructor(private dataService:DataService, private toastService:ToastService) { }

  async uploadRegistration(photoInput:HTMLInputElement){
    
    if(!photoInput.files.length) return;
    
    let file = photoInput.files[0];

    if(file.name.split(".").pop().toLowerCase() !== "pdf"){
      this.toastService.toast("Soubor musí být ve formátu PDF");
      return;
    }

    let formData: FormData = new FormData();

    formData.set("file",file,file.name);

    await this.dataService.uploadEventRegistration(this.event._id,formData);
    
    this.saved.emit();
    
    this.toastService.toast("Přihláška nahrána.");
  }
  
  async deleteRegistration(){
    await this.dataService.deleteEventRegistration(this.event._id);
    
    this.saved.emit();
    
    this.toastService.toast("Přihláška smazána.");
  }

}
