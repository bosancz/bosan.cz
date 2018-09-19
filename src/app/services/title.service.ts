import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";

import { DataService } from "app/services/data.service";

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  
  constructor(private title:Title,private dataService:DataService) {
    this.getMainTitle();
  }
  
  async getMainTitle(){
    var config = await this.dataService.getConfig();
    return config.general.title;
  }
  
  async setTitle(title:string){
    let mainTitle = await this.getMainTitle();
    let entireTitle = (title ? title + " :: " : "") + mainTitle;
    this.title.setTitle(entireTitle);
  }
}
