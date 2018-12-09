import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";
import { ToastService } from "app/services/toast.service";
import { AuthService } from "app/services/auth.service";

import { User } from "app/schema/user";

@Component({
  selector: 'my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {

  cat:string;
  
  user:User;
  
  passwordsVisible:boolean = false;

  paramsSubscription:Subscription;
  
  constructor(private api:ApiService, private toastService:ToastService, private authService:AuthService, private route:ActivatedRoute) { }

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
    this.user = await this.api.get<User>("me:user");
  }
  
  async updateUser(form:NgForm){
    
    let userData = form.value;
    
    await this.api.patch("me:user",userData);
    
    this.toastService.toast("Uloženo.");
    
  }
  
  async updatePassword(form:NgForm){
    
    let userData = form.value;
    
    await this.api.patch("me:user",userData);
    
    this.toastService.toast("Uloženo.");
    
  }
}
