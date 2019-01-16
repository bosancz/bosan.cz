import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { ConfigService } from "app/services/config.service";
import { ToastService } from "app/services/toast.service";

import { WebConfig } from "app/schema/webconfig";
import { CodelistField } from "../../components/codelist-editor/codelist-editor.component";

const colorPattern = "^([rR][gG][bB][aA]\\([\\d\\.]*\\d,[\\d\\.]*\\d,[\\d\\.]*\\d,[\\d\\.]*\\d\\)|[rR][gG][bB]\\([\\d\\.]*\\d,[\\d\\.]*\\d,[\\d\\.]*\\d\\)|#[0-9a-fA-F]{8}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})$";

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
    {"name": "color", "title": "Barva (#HEX)", "pattern": colorPattern, "type": "text","placeholder":"#A1B2C3"},
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

  eventStatusFields:CodelistField[] = [
    {"name": "id", "title": "ID", "type": "text"},
    {"name": "name", "title": "Název", "type": "text"},
    {"name": "class", "title": "CSS třída", "type": "text"}
  ];
  
  eventTypeFields:CodelistField[] = [
    {"name": "name", "title": "Název", "type": "text"},
    {"name": "class", "title": "CSS třída", "type": "text"}
  ];
  
  eventSubTypeFields:CodelistField[] = [
    {"name": "name", "title": "Název", "type": "text"},
    {"name": "color", "title": "Barva (#HEX)", "type": "text", "pattern": colorPattern, "placeholder":"#A1B2C3"},
    {"name": "image", "title": "URL obrázku", "type": "text"}
  ];
  
  eventExpenseTypeFields:CodelistField[] = [
    {"name": "name", "title": "Typ", "type": "text"}
  ];  
  
  eventDescriptionWarningsFields:CodelistField[] = [
    {"name": "regexp", "title": "RegExp", "type": "text"},
    {"name": "regexpModifiers", "title": "RegExp modifikátory", "type": "text"},
    {"name": "text", "title": "Varování", "type": "text"}
  ];
  
  paymentTypeFields:CodelistField[] = [
    {"name": "name", "title": "ID", "type": "text"}
  ];
  
  memberRolesFields:CodelistField[] = [
    {"name": "id", "title": "ID", "type": "text"}
  ];
  
  userRolesFields:CodelistField[] = [
    {"name": "name", "title": "ID", "type": "text"},
    {"name": "title", "title": "Název", "type": "text"},
    {"name": "description", "title": "Popis", "type": "text"}
  ];
  
  modified:boolean = false;
  
  config:WebConfig;
  
  viewJson:boolean = false;
  jsonError:boolean = false;
  
  paramsSubscription:Subscription;
  configSubscription:Subscription;
  
  constructor(private configService:ConfigService, private toastService:ToastService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.cat = params.cat;
    });
    
    this.configSubscription = this.configService.config.subscribe(config => this.config = JSON.parse(JSON.stringify(config)));
  }
  
  ngOnDestroy(){
    this.paramsSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
  }
  
  async saveConfig(){
    await this.configService.saveConfig(this.config);
    this.toastService.toast("Uloženo.");
  }
  
  resetConfig(){
    this.configService.updateConfig();
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
      const config = JSON.parse(json);
      this.jsonError = false;
      this.config = config;
    }
    catch(err){
      this.jsonError = true;
    }
  }

}
