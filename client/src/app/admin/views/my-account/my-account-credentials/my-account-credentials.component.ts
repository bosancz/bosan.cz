import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";

import { User } from "app/shared/schema/user";

@Component({
  selector: 'my-account-credentials',
  templateUrl: './my-account-credentials.component.html',
  styleUrls: ['./my-account-credentials.component.scss']
})
export class MyAccountCredentialsComponent implements OnInit {
  
  user:User;
  
  passwordsVisible:boolean = false;

  constructor(private api:ApiService, private toastService:ToastService) { }
  
  ngOnInit() {
    this.loadUser();
    
  }
    
  async loadUser(){
    this.user = await this.api.get<User>("me:user");
  }

  async updateCredentials(form:NgForm){
    
    let userData = form.value;
    
    await this.api.put(this.user._links.credentials,userData);
    
    this.toastService.toast("Uloženo.");
    
  }

}
