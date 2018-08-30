import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { DataService } from "../../../services/data.service";
import { ToastService } from "../../../services/toast.service";

import { WebConfig } from "../../../schema/webconfig";
import { CodelistField } from "../../components/codelist-editor/codelist-editor.component";

@Component({
  selector: 'web-admin',
  templateUrl: './web-admin.component.html',
  styleUrls: ['./web-admin.component.css']
})
export class WebAdminComponent implements OnInit, OnDestroy {

  cat:string = "about";
  
  groupFields:CodelistField[] = [
    {"name": "id", "title": "ID", "type": "text", "required": true},
    {"name": "name", "title": "Jméno", "type": "text"},
    {"name": "color", "title": "Barva (#HEX)", "type": "text", "pattern": "\#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})","placeholder":"#A1B2C3"},
    {"name": "active", "title": "Aktivní", "type": "checkbox"}
  ];
  
  contactFields:CodelistField[] = [
    {"name": "name", "title": "Jméno", "type": "text"},
    {"name": "nickname", "title": "Přezdívka", "type": "text"},
    {"name": "avatar", "title": "Avatar", "type": "text"},
    {"name": "role", "title": "Role", "type": "text"},
    {"name": "email", "title": "E-mail", "type": "text"},
    {"name": "mobile", "title": "Mobil", "type": "text"}
  ];
  
  eventTypeFields:CodelistField[] = [
    {"name": "name", "title": "Název", "type": "text"},
    {"name": "class", "title": "CSS třída", "type": "text"}
  ];
  
  eventSubTypeFields:CodelistField[] = [
    {"name": "name", "title": "Název", "type": "text"},
    {"name": "color", "title": "Barva (#HEX)", "type": "text", "pattern": "\#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})","placeholder":"#A1B2C3"},
    {"name": "image", "title": "URL obrázku", "type": "text"}
  ];
  
  eventRecurringTypeFields:CodelistField[] = [
    {"name": "name", "title": "ID", "type": "text"},
    {"name": "title", "title": "Název", "type": "text"}
  ];      
  
  memberRolesFields:CodelistField[] = [
    {"name": "id", "title": "ID", "type": "text"}
  ];
  
  userRolesFields:CodelistField[] = [
    {"name": "name", "title": "ID", "type": "text"},
    {"name": "title", "title": "Název", "type": "text"},
    {"name": "description", "title": "Popis", "type": "text"}
  ]
  
  modified:boolean = false;
  
  config:WebConfig;
  
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
    this.config = await this.dataService.getConfig(true).then(config => JSON.parse(JSON.stringify(config)));
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
