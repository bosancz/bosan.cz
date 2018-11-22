import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { ToastService } from "app/services/toast.service";

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private router:Router, private toastService:ToastService) { }

  ngOnInit() {
    this.toastService.toast("Stránka \"" + (location.pathname || location.href) + "\" neexistuje.");
    this.router.navigate(["/"],{replaceUrl: true});    
  }

}
