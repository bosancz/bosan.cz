import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

import { User } from "../../../schema/user";

@Component({
  selector: 'users-admin',
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.css']
})
export class UsersAdminComponent implements OnInit, OnDestroy {

  users:User[] = [];
  
  roleNames:any = {};
  
  active:boolean;

  createUserModalRef: BsModalRef;
  
  paramsSubscription:Subscription;

  constructor(private dataService:DataService, private toastService:ToastService, private router:Router, private route:ActivatedRoute, private modalService: BsModalService) { }

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
  
  async loadRoleNames(){
    let config = await this.dataService.getConfig();
    this.roleNames = {};
    config.users.roles.forEach(role => this.roleNames[role.name] = role.title);
  }

  getUserLink(user:User):string{
    return '/interni/uzivatele/' + user._id;
  }

  openUser(user:User):void{
    this.router.navigate([this.getUserLink(user)], {relativeTo: this.route});
  }

  openCreateUserModal(template: TemplateRef<any>){
    this.createUserModalRef = this.modalService.show(template);
  }

  async createUser(form:NgForm){
    // get data from form
    var userData = form.value;
    var userId = userData._id;
    // create the user and wait for confirmation
    await this.dataService.createUser(userId,userData);
    // close the modal
    this.createUserModalRef.hide();
    // show the confrmation
    this.toastService.toast("Uživatel vytvořen.");
    // open the user
    this.router.navigate(["/interni/uzivatele/" + userId], {relativeTo: this.route})
  }
}
