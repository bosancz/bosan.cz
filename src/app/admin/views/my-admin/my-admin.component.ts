import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from "@angular/forms";

import { Subscription } from "rxjs";

import { DataService } from "../../../services/data.service";
import { AuthService } from "../../../services/auth.service";

import { User } from "../../../schema/user";

@Component({
  selector: 'my-admin',
  templateUrl: './my-admin.component.html',
  styleUrls: ['./my-admin.component.scss']
})
export class MyAdminComponent implements OnInit, OnDestroy {

  cat:string;
  
  user:User;
  
  passwordsVisible:boolean = false;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private authService:AuthService, private route:ActivatedRoute) { }

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
    
    var userId = this.authService.user._id;
    
    this.user = await this.dataService.getUser(userId);
    
  }
  
  changePassword(form:NgForm){
    
  }

}
