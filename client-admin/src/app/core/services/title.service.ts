import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { BehaviorSubject } from 'rxjs';

import { ConfigService } from "app/core/services/config.service";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  pageTitle = new BehaviorSubject<string | null>(null);

  private mainTitle?: string;

  constructor(private title: Title, private configService: ConfigService) {
    this.pageTitle.subscribe(() => this.updateWindowTitle());
    this.configService.getConfig("config.general.title").then(title => this.mainTitle = title);
  }

  setPageTitle(title: string | null) {
    setTimeout(() => this.pageTitle.next(title || null), 0);
  }

  private updateWindowTitle() {
    const titleParts = [];
    if (this.pageTitle.value) titleParts.push(this.pageTitle.value);
    if (this.mainTitle) titleParts.push(this.mainTitle);
    return this.title.setTitle(titleParts.join(" :: "));
  }

  reset() {
    this.setPageTitle(null);
  }
}
