import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";

import { ConfigService } from "app/services/config.service";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  subTitle:string;
  mainTitle:string;

  constructor(private title:Title,private configService:ConfigService) {
    
    this.configService.config.subscribe(config => {
      this.mainTitle = config.general.title;
      this.updateTitle();
    });
    
  }

  setTitle(title:string){
    this.subTitle = title;
    this.updateTitle();
  }

  updateTitle(){
    let entireTitle = (this.subTitle ? this.subTitle + " :: " : "") + this.mainTitle;
    return this.title.setTitle(entireTitle);
  }
}
