import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable, ReplaySubject } from "rxjs";
import { tap } from 'rxjs/operators';

import { environment } from "environments/environment";

import { WebConfig } from "app/schema/web-config";

import { first } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  root: string = environment.apiRoot;

  config: ReplaySubject<WebConfig> = new ReplaySubject(1);

  constructor(private http: HttpClient) {
    this.updateConfig();
  }

  /* CONFIG */
  getConfig(): Promise<WebConfig>;
  getConfig(path: string): Promise<any>;
  getConfig(path?: string): Promise<WebConfig | any> {
    const config = this.config.pipe(first()).toPromise();

    if (path) return config.then(config => this.getPathValue(config, path));
    else return config;
  }

  // TODO: some old untyped code 🤦‍♀️
  private getPathValue(config: WebConfig, path: string): any {
    const parts = path.split(".");
    let value: any = config;
    let part;
    while (part = <keyof WebConfig>parts.shift()) {
      value = value && value[part] || undefined;
    }
    return value;
  }

  async updateConfig(): Promise<void> {
    const config = await this.http.get<WebConfig>(this.root + "/config").toPromise();
    this.config.next(config);
  }

  saveConfig(config: WebConfig): Promise<string> {
    return this.http.put(this.root + "/config", config, { responseType: "text" })
      .pipe(tap(() => this.updateConfig()))
      .toPromise();
  }
}
