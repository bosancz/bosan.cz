import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable, ReplaySubject } from "rxjs";
import { tap } from 'rxjs/operators';

import { environment } from "environments/environment";

import { WebConfig } from "app/core/schema/webconfig";

import { first } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  root:string = environment.apiRoot;
  
  config:ReplaySubject<WebConfig> = new ReplaySubject(1);

  constructor(private http:HttpClient) {
    this.updateConfig();
  }
  
  /* CONFIG */
  getConfig():Promise<WebConfig>{
    return this.config.pipe(first()).toPromise();
  }
  
  async updateConfig():Promise<void>{
    const config = await this.http.get<WebConfig>(this.root + "/config").toPromise();
    this.config.next(config)
  }

  saveConfig(config:WebConfig):Promise<string>{
    return this.http.put(this.root + "/config", config, { responseType: "text" })
      .pipe(tap(() => this.updateConfig()))
      .toPromise();
  }
}
