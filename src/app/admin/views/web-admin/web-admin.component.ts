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
  
  eventTypeFields = [
    {"name": "id", "title": "ID", "type": "text"},
    {"name": "title", "title": "Název", "type": "text"},
    {"name": "image", "title": "Obrázek", "type": "text"}
  ];
  
  memberRoleFields = [
    {"name": "id", "title": "ID", "type": "text"}
  ];
  
  defaultTagsFields = [
    {"name": "tag", "title": "Tag", "type": "text"}
  ];
  
  modified:boolean = false;
  
  config:WebConfig = new WebConfig();
  
  viewJson:boolean = false;
  jsonError:boolean = false;
  
  paramsSubscription:Subscription;
  
  constructor(private dataService:DataService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.cat = params.cat;
    });
    this.loadConfig();
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
  }
  
  async loadConfig(){
    var config = await this.dataService.getConfig(true).then(config => JSON.parse(JSON.stringify(config)));
    this.config = Object.assign({},new WebConfig(),config);
  }
  
  async saveConfig(){
    await this.dataService.saveConfig(this.config);
    await this.loadConfig();
    this.toastService.toast("Uloženo.");
  }
  
  resetConfig(){
    this.loadConfig();
  }
  
  listFromString(string:string):string[]{
    if(!string) return [];
    return string.split(",").map(item => item.trim());
  }
  
  listToString(list:string[]):string{
    if(!list) return "";
    return list.join(",");
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
