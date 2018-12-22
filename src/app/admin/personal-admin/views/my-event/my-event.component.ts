import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";
import { ConfigService } from "app/services/config.service";

import { Event } from "app/schema/event";
import { Member } from "app/schema/member";

@Component({
  selector: 'my-event',
  templateUrl: './my-event.component.html',
  styleUrls: ['./my-event.component.scss']
})
export class MyEventComponent implements OnInit, OnDestroy {

  event:Event;
  eventData:Event;
  
  eventTypes:string[] = [];
  eventSubTypes:string[] = [];

  uploadingRegistration:boolean = false;

  allDay:boolean = false;

  @ViewChild("basicInfoModal") basicInfoModal:TemplateRef<any>;
  @ViewChild("leadersModal") leadersModal:TemplateRef<any>;
  @ViewChild("attendeesModal") attendeesModal:TemplateRef<any>;
  
  modalState:string;
  
  modalRef:BsModalRef;

  modalSubscription:Subscription;
  paramsSubscription:Subscription;

  constructor(
    private api:ApiService,
    private router:Router,
    private route:ActivatedRoute,
    private modalService:BsModalService,
    private toastService:ToastService,
    private location:Location,
    private configService:ConfigService
  ) { }

  ngOnInit() {
    
    this.loadConfig();
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      if(!this.event || params.akce !== this.event._id) this.loadEvent(params.akce);
      if(params.modal !== "open" && this.modalRef) this.modalRef.hide();
      this.modalState = params.modal;
    });
    
    this.modalSubscription = this.modalService.onHide.subscribe(() => {
      if(this.modalState) this.location.back();
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.modalSubscription.unsubscribe();
  }
  
  async loadConfig(){
    const config = await this.configService.getConfig();
    
    this.eventTypes = config.events.types.map(type => type.name);
    this.eventSubTypes = config.events.subtypes.map(type => type.name);
  }

  async loadEvent(eventId:string) {
    this.event = await this.api.get<Event>(["event",eventId],{populate:["leaders"]});

    this.eventData = JSON.parse(JSON.stringify(this.event));

    this.eventData.attendees.sort((a,b) => a.nickname.localeCompare(b.nickname));
    
    this.allDay = !this.eventData.timeFrom && !this.eventData.timeTill;
  }

  async saveEvent(){
    const eventData = this.eventData;
    
    eventData.timeFrom = eventData.timeFrom || null;
    eventData.timeTill = eventData.timeTill || null;
    if(!eventData.groups || !eventData.groups.length) eventData.leadersEvent = true;
    
    await this.api.patch(this.event._links.self,eventData);
    this.event = await this.api.get<Event>(this.event._links.self);
    this.toastService.toast("Uloženo.");
  }

  async uploadRegistration(registrationInput:HTMLInputElement){

    if(!registrationInput.files.length) return;

    let file = registrationInput.files[0];

    if(file.name.split(".").pop().toLowerCase() !== "pdf"){
      this.toastService.toast("Soubor musí být ve formátu PDF");
      return;
    }

    let formData:FormData = new FormData();

    formData.set("file",file,file.name);

    this.uploadingRegistration = true;

    try{
      await this.api.post(this.event._links.registration,formData);
    }
    catch(err){
      this.toastService.toast("Nastala chyba při nahrávání: " + err.message);
    }

    this.uploadingRegistration = false;

    this.loadEvent(this.event._id);

    this.toastService.toast("Přihláška nahrána.");
  }

  async deleteRegistration(){
    await this.api.delete(this.event._links.registration);
    this.loadEvent(this.event._id);
    this.toastService.toast("Přihláška smazána.");
  }

  getRegistrationUrl():string{
    return this.api.link2href(this.event._links.registration);
  }

  reset(){
    this.eventData = JSON.parse(JSON.stringify(this.event));
  }

  openModal(modal:TemplateRef<any>){
    this.router.navigate(['./',{modal:"open"}], { relativeTo: this.route });
    this.modalRef = this.modalService.show(modal, { animated: false });
  }

  removeItem(item:any,array:any[]):void{
    array.splice(array.indexOf(item),1);
  }

  getMemberTooltip(member:Member,groupName:string){
    const info = [groupName];
    if(member.name) info.push(member.name.first + " " + member.name.last);
    if(member.role) info.push(member.role);
    return info.join(", ");
  }
}
