import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

import { Member } from "../../../schema/member";
import { WebConfigGroup } from "../../../schema/webconfig";

@Component({
  selector: 'members-admin',
  templateUrl: './members-admin.component.html',
  styleUrls: ['./members-admin.component.css']
})
export class MembersAdminComponent implements OnInit {

  members:Member[] = [];
  
  groups:WebConfigGroup[] = [];
  roles:string[] = [];
  
  view:string;
  
  views:any = {
    "all": {},
    "group": {group:null}
  };
  
  createMemberModalRef: BsModalRef;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private router:Router, private route:ActivatedRoute, private modalService: BsModalService) { }

  ngOnInit() {
    this.loadGroups();
    this.loadRoles();
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      
      if(!params.view || !this.views[params.view]) return this.router.navigate(["./", {view: "all"}], {relativeTo: this.route, replaceUrl: true});
      
      this.view = params.view;
      this.views.group.group = params.group;
      
      this.loadMembers(params.view);
    });
  }
  
  async loadGroups(){
    let config = await this.dataService.getConfig();
    this.groups = config.groups;
  }
  
  async loadRoles(){
    var config = await this.dataService.getConfig();
    this.roles = config.members.roles.map(item => item.id);
  }
  
  async loadMembers(view:string){
    
    var options = Object.assign({},this.views[view] || {})
    this.members = await this.dataService.getMembers(options);
  }
  
  openCreateMemberModal(template: TemplateRef<any>){
    this.createMemberModalRef = this.modalService.show(template);
  }
  
  async createMember(form:NgForm){
    // get data from form
    var eventData = form.value;
    // create the event and wait for confirmation
    var member = await this.dataService.createMember(eventData);
    // close the modal
    this.createMemberModalRef.hide();
    // show the confrmation
    this.toastService.toast("Člen uložen.");
    // open the event
    this.router.navigate(["./" + member._id], {relativeTo: this.route})
  }
  
  getMemberLink(member:Member):string{
    return '/interni/clenove/' + member._id;
  }
  
  openMember(member:Member):void{
    this.router.navigate([this.getMemberLink(member)], {relativeTo: this.route});
  }

}
