import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ApiService } from "app/core/services/api.service";
import { LoginService } from "app/core/services/login.service";
import { ConfigService } from "app/core/services/config.service";
import { ToastService } from "app/core/services/toast.service";

import { User } from "app/core/schema/user";

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

  constructor(
    private api:ApiService,
    private loginService:LoginService,
    private configService:ConfigService,
    private toastService:ToastService,
    private router:Router,
    private route:ActivatedRoute,
    private modalService:BsModalService
   ) { }

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
    this.users = await this.api.get<User[]>("users",{active:this.active ? 1 : 0,members:1});
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
    // create the user and wait for confirmation
    const response = await this.api.post("users",userData);
    // close the modal
    this.createUserModalRef.hide();
    // show the confrmation
    this.toastService.toast("Uživatel vytvořen.");
    // get the new user
    const user = await this.api.get<User>(response.headers.get("location"));
    // open the user
    this.router.navigate(["./",user._id], {relativeTo: this.route});
  }
  
  async impersonateUser(event:Event,user:User):Promise<void>{
    
    event.stopPropagation();
    
    await this.loginService.loginImpersonate(user._id);
    
    this.toastService.toast("Přihlášen jako " + user.login);
    this.router.navigate(["/"]);
  }
}
