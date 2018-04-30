import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";
import { MenuService } from "../../services/menu.service";

import { Member } from "../../schema/member";

@Component({
  selector: 'about-view',
  templateUrl: "about-view.component.html",
  styleUrls: ["about-view.component.css"]
})
export class AboutViewComponent implements OnInit, OnDestroy {
  
  contacts:Member[] = [];

  constructor(private dataService:DataService, private toastService:ToastService, private menuService:MenuService) {
    this.menuService.transparent = true;
  }

  ngOnInit() {
    
    this.dataService.getMembersFrontpage()
      .then(members => members.sort((a,b) => a.frontpage - b.frontpage))
      .then(members => this.contacts = members)
      .catch(err => this.toastService.toast(err.message,"error"));
  }
  
  ngOnDestroy(){
    this.menuService.transparent = false;
  }
  
  slideDown(){
    console.log("test");
  }

}
