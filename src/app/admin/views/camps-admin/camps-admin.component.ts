import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

import { Camp } from "../../../schema/camp";

@Component({
  selector: 'camps-admin',
  templateUrl: './camps-admin.component.html',
  styleUrls: ['./camps-admin.component.css']
})
export class CampsAdminComponent implements OnInit, OnDestroy {

  camps:Camp[];
  
  view:string;
  
  views:any = {
    "future": {dateFrom: (new Date()).toISOString()},
    "past": {dateTill: (new Date()).toISOString()},
    "all": {}
  };
  
  createCampModalRef: BsModalRef;
  
  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private router:Router, private route:ActivatedRoute, private modalService: BsModalService, private toastService:ToastService) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(!params.view || !this.views[params.view]) return this.router.navigate(["./", {view: "all"}], {relativeTo: this.route, replaceUrl: true});
      
      this.view = params.view;
      
      this.loadCamps();
    });
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadCamps(){
    
    let generalOptions = {}
    let options = Object.assign(generalOptions,this.views[this.view] || {});
    
    this.camps = await this.dataService.getCamps(options);
  }
  
  async createCamp(form:NgForm){
    // get data from form
    var campData = form.value;
    // create the camp and wait for confirmation
    var camp = await this.dataService.createCamp(campData);
    // close the modal
    this.createCampModalRef.hide();
    // show the confrmation
    this.toastService.toast("Tábor vytvořen a uložen.");
    // open the camp
    this.router.navigate(["./" + camp._id], {relativeTo: this.route})
  }
  
  openCamp(camp:Camp):void{
    this.router.navigate(['./' + camp._id], {relativeTo: this.route});
  }
  
  openCreateCampModal(template: TemplateRef<any>){
    this.createCampModalRef = this.modalService.show(template);
  }

}
