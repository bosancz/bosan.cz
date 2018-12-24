import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ConfigService } from "app/services/config.service";
import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";

import { Member } from "app/schema/member";
import { WebConfigGroup } from "app/schema/webconfig";

@Component({
  selector: 'members-admin',
  templateUrl: './members-admin.component.html',
  styleUrls: ['./members-admin.component.css']
})
export class MembersAdminComponent implements OnInit, OnDestroy {

  members:Member[] = [];
  
  groups:WebConfigGroup[] = [];
  roles:string[] = [];
  
  view:string;
  
  views:any = {
    "all": {},
    "group": {group:null}
  };
  
  createMemberModalRef:BsModalRef;
  
  paramsSubscription:Subscription;
  
  constructor(private api:ApiService, private configService:ConfigService, private toastService:ToastService, private router:Router, private route:ActivatedRoute, private modalService:BsModalService) { }

  ngOnInit() {
    this.loadConfig();
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(!params.view || !this.views[params.view]) return this.router.navigate(["./", {view: "all"}], {relativeTo: this.route, replaceUrl: true});
      
      this.view = params.view;
      this.views.group.group = params.group;
      
      this.loadMembers(params.view);
    });
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }
  
  loadConfig(){
    this.configService.getConfig().then(config => {
      this.groups = config.members.groups;
      this.roles = config.members.roles.map(item => item.id);
    })
  }
  
  async loadMembers(view:string){
    const options = Object.assign({},this.views[view] || {});
    this.members = await this.api.get<Member[]>("members",options);
  }
  
  openCreateMemberModal(template:TemplateRef<any>){
    this.createMemberModalRef = this.modalService.show(template);
  }
  
  async createMember(form:NgForm){
    // get data from form
    const eventData = form.value;
    // create the event and wait for confirmation
    const response = await this.api.post("members",eventData);
    // get new member _id
    let member = await this.api.get<Member>(response.headers.get("location"),{ select: "_id"});
    // close the modal
    this.createMemberModalRef.hide();
    // show the confrmation
    this.toastService.toast("Člen uložen.");
    // open the event
    this.router.navigate(["./",{},member._id], {relativeTo: this.route});
  }
  
}
