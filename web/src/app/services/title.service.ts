import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { BehaviorSubject } from 'rxjs';

import { General } from "config/general";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  pageTitle: BehaviorSubject<string> = new BehaviorSubject(null);

  private mainTitle: string = General.title;

  constructor(private title: Title) {
    this.pageTitle.subscribe(() => this.updateWindowTitle());
  }

  setPageTitle(title: string) {
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
