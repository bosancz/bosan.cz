import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";
import { AuthService } from "../../../services/auth.service";

import { User } from "../../../schema/user";

@Component({
  selector: 'account-admin',
  templateUrl: './account-admin.component.html',
  styleUrls: ['./account-admin.component.scss']
})
export class AccountAdminComponent implements OnInit, OnDestroy {

  cat:string;
  
  user:User;
  
  passwordsVisible:boolean = false;

  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private authService:AuthService, private route:ActivatedRoute) { }

  ngOnInit() {
    
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.cat = params.cat;
    });
    
    this.loadUser();
    
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }
  
  async loadUser(){
    
    this.user = await this.dataService.getMe();
    
  }
  
  async updateUser(form:NgForm){
    
    var userData = form.value;
    
    await this.dataService.updateMe(userData);
    
    this.toastService.toast("Uloženo.");
    
  }
  
  async updatePassword(form:NgForm){
    
    var userData = form.value;
    
    await this.dataService.updateMyPassword(userData);
    
    this.toastService.toast("Uloženo.");
    
  }
}
