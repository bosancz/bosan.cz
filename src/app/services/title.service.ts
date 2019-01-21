import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { BehaviorSubject } from 'rxjs';

import { ConfigService } from "app/services/config.service";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  subTitle:BehaviorSubject<string> = new BehaviorSubject(null);
  mainTitle:string;

  constructor(private title:Title,private configService:ConfigService) {    
    this.subTitle.subscribe(() => this.updateWindowTitle());
    this.configService.getConfig().then(config => this.mainTitle = config.general.title);
  }

  setTitle(title:string){
    this.subTitle.next(title || null);
  }

  updateWindowTitle(){
    const titleParts = [];
    if(this.subTitle.value) titleParts.push(this.subTitle.value);
    if(this.mainTitle) titleParts.push(this.mainTitle);
    return this.title.setTitle(titleParts.join(" :: "));
  }
}
