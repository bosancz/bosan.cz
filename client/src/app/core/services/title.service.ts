import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { BehaviorSubject } from 'rxjs';

import { ConfigService } from "app/core/services/config.service";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  pageTitle:BehaviorSubject<string> = new BehaviorSubject(null);
  
  private mainTitle:string;

  constructor(private title:Title,private configService:ConfigService) {    
    this.pageTitle.subscribe(() => this.updateWindowTitle());
    this.configService.getConfig().then(config => this.mainTitle = config.general.title);
  }

  setPageTitle(title:string){
    this.pageTitle.next(title || null);
  }

  private updateWindowTitle(){
    const titleParts = [];
    if(this.pageTitle.value) titleParts.push(this.pageTitle.value);
    if(this.mainTitle) titleParts.push(this.mainTitle);
    return this.title.setTitle(titleParts.join(" :: "));
  }

  reset(){
    this.pageTitle.next(null);
  }
}
