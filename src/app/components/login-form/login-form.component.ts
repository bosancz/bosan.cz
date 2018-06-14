import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from "../../services/auth.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(public loginModal: BsModalRef, private authService:AuthService, private router:Router, private toastService:ToastService) { }

  ngOnInit() {
  }
  
  login(loginForm:NgForm){
    
    var loginData = loginForm.value;
    
    this.authService.login(loginData)
      .then(user => {
        this.loginModal.hide();
        this.router.navigate(["/interni"]);
      })
      .catch(err => this.toastService.toast("Chybn0 přihlašovací jméno nebo heslo."));
  }
  

}
