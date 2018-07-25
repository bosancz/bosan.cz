import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

import { WebConfig } from "../../../schema/webconfig";

@Component({
  selector: 'web-admin',
  templateUrl: './web-admin.component.html',
  styleUrls: ['./web-admin.component.css']
})
export class WebAdminComponent implements OnInit, OnDestroy {

  cat:string = "about";
  
  modified:boolean = false;
  
  config:WebConfig = new WebConfig();
  
  viewJson:boolean = false;
  jsonError:boolean = false;
  
  //todo: move somewhere more apropriate
  routing:any = {
    "o-nas": "about",
    "dokumenty": "documents"
  }
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.cat = this.routing[params.cat];
    });
    this.loadConfig();
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }
  
  loadConfig(){
    this.dataService.getConfig(true).then(config => {
      this.config = JSON.parse(JSON.stringify(config))
    });
  }
  
  saveConfig(){
    this.dataService.saveConfig(this.config)
      .then(() => this.toastService.toast("Uloženo."));
  }
  
  resetConfig(){
    this.loadConfig();
  }
  
  editJson(json){
    try{
      var config = JSON.parse(json);
      this.jsonError = false;
      this.config = config;
    }
    catch(err){
      this.jsonError = true;
    }
  }

}
