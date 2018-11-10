import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ConfigService } from "app/services/config.service";
import { DataService } from "app/services/data.service";
import { ToastService } from "app/services/toast.service";

import { User } from "app/schema/user";

@Component({
  selector: 'users-admin',
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.css']
})
export class UsersAdminComponent implements OnInit, OnDestroy {

  users:User[] = [];
  
  roleNames:any = {};
  
  active:boolean;

  createUserModalRef:BsModalRef;
  
  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private configService:ConfigService, private toastService:ToastService, private router:Router, private route:ActivatedRoute, private modalService:BsModalService) { }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {

      if(params.active === undefined) return this.router.navigate(["./", {active:1}], {relativeTo: this.route, replaceUrl: true});
      
      this.active = !!params.active;

      this.loadUsers();
    });
    
    this.loadRoleNames();
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }

  async loadUsers(){
    this.users = await this.dataService.getUsers({active:this.active ? 1 : 0,members:1});
  }
  
  loadRoleNames(){
    this.configService.getConfig().then(config => {      
      this.roleNames = {};
      config.users.roles.forEach(role => this.roleNames[role.name] = role.title);
    });
  }

  openCreateUserModal(template:TemplateRef<any>){
    this.createUserModalRef = this.modalService.show(template);
  }

  async createUser(form:NgForm){
    // get data from form
    const userData = form.value;
    const userId = userData._id;
    // create the user and wait for confirmation
    await this.dataService.createUser(userId,userData);
    // close the modal
    this.createUserModalRef.hide();
    // show the confrmation
    this.toastService.toast("Uživatel vytvořen.");
    // open the user
    this.router.navigate(["./",{},userId], {relativeTo: this.route});
  }
}
