import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  pageTitle = new BehaviorSubject<string | null>(null);

  private mainTitle?: string = "Bošán interní";

  constructor(private title: Title) {
    this.pageTitle.subscribe(() => this.updateWindowTitle());
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
