import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DateTime } from "luxon";

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";
import { ConfigService } from "app/core/services/config.service";

import { Event, EventExpense } from "app/shared/schema/event";
import { Member } from "app/shared/schema/member";

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
  expenseTypes:string[] = [];

  uploadingRegistration:boolean = false;
  uploadingAccounting:boolean = false;

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
    this.expenseTypes = config.events.expenseTypes.map(type => type.name);
  }

  async loadEvent(eventId:string) {
    this.event = await this.api.get<Event>(["event",eventId],{populate:["leaders"]});
    this.setFormData();
  }

  async saveEvent(){
    const eventData = this.eventData;
    
    eventData.timeFrom = eventData.timeFrom || null;
    eventData.timeTill = eventData.timeTill || null;
    if(!eventData.groups || !eventData.groups.length) eventData.leadersEvent = true;
    
    await this.api.patch(this.event._links.self,eventData);
    await this.loadEvent(this.event._id);
    this.toastService.toast("Uloženo.");
  }

  async deleteEvent(){
    if(window.confirm("Opravdu chcete smazat tuto akci?")){
      await this.api.delete(this.event._links.self);
      this.router.navigate(["../"], {relativeTo: this.route});
      this.toastService.toast("Akce smazána");
    }
  }

  async rejectEvent():Promise<void>{
    const note = window.prompt("Poznámka k vrácení akce:")
    
    // hit cancel in the prompt cancels the action
    if(note === null) return;

    await this.api.post(this.event._actions.reject, { note: note || undefined } );
    await this.loadEvent(this.event._id);
    
    this.toastService.toast("Vráceno k úpravám.");
  }
  
  async eventAction(action:string){
    await this.api.post(this.event._actions[action]);
    await this.loadEvent(this.event._id);
    this.toastService.toast("Uloženo");
  }
  
  async uploadRegistration(input:HTMLInputElement){

    if(!input.files.length) return;

    let file = input.files[0];

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
  
  async uploadAccounting(input:HTMLInputElement){

    if(!input.files.length) return;

    let file = input.files[0];

    if(file.name.split(".").pop().toLowerCase() !== "xlsx"){
      this.toastService.toast("Soubor musí být ve formátu XLSX");
      return;
    }

    let formData:FormData = new FormData();

    formData.set("file",file,file.name);

    this.uploadingAccounting = true;

    try{
      await this.api.post(this.event._links.accounting,formData);
    }
    catch(err){
      this.toastService.toast("Nastala chyba při nahrávání: " + err.message);
    }

    this.uploadingAccounting = false;

    this.loadEvent(this.event._id);

    this.toastService.toast("Účetnictví nahráno.");
  }

  async deleteAccounting(){
    await this.api.delete(this.event._links.accounting);
    this.loadEvent(this.event._id);
    this.toastService.toast("Účetnictví smazáno.");
  }

  getAccountingUrl():string{
    return this.api.link2href(this.event._links.accounting);
  }
  
  getAccountingTemplateUrl():string{
    return this.api.link2href(this.event._links["accounting-template"]);
  }
  
  getAnnouncementTemplateUrl():string{
    return this.api.link2href(this.event._links["announcement-template"]);
  }


  setFormData(){
    const eventData = JSON.parse(JSON.stringify(this.event));

    eventData.attendees.sort((a,b) => a.nickname.localeCompare(b.nickname));
    
    if(!eventData.meeting) eventData.meeting = { start: undefined, end: undefined };
    if(!eventData.competition) eventData.competition = { river: undefined, water_km:undefined }
    if(!eventData.expenses) eventData.expenses = [];
    
    eventData.dateFrom = DateTime.fromISO(eventData.dateFrom).toISODate();
    eventData.dateTill = DateTime.fromISO(eventData.dateTill).toISODate();
    
    this.eventData = eventData;
    this.allDay = !eventData.timeFrom && !eventData.timeTill;
    
  }

  openModal(modal:TemplateRef<any>){
    this.router.navigate(['./',{modal:"open"}], { relativeTo: this.route });
    const modalOptions:ModalOptions = { animated: false };
    this.modalRef = this.modalService.show(modal, modalOptions);
  }
  
  reset(){
    this.setFormData();
  }

  removeItem(item:any,array:any[]):void{
    array.splice(array.indexOf(item),1);
  }

  addExpense(){
    this.eventData.expenses.push(new EventExpense());
  }
  
  removeExpense(expense:EventExpense){
    this.eventData.expenses.splice(this.eventData.expenses.indexOf(expense),1);
  }
  
}
