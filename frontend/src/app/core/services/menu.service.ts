import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UrlTree } from '@angular/router';

export interface SecondaryMenuItem {
  path: string | any[],
  label: string;
}

export interface ActionItem {
  type: "action" | "divider";
  label?: string;
  callback?: () => any;
  disabled?: boolean;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  visible = new BehaviorSubject(true);
  transparent = new BehaviorSubject(false);

  secondaryMenu: TemplateRef<any> | null = null;

  actionMenu: TemplateRef<any> | null = null;

  menuButtons: TemplateRef<any>[] = [];

  constructor() { }

  hide() {
    setTimeout(() => this.visible.next(false), 0);
  }

  setTransparent(status: boolean) {
    setTimeout(() => this.transparent.next(status), 0);
  }

  reset() {
    this.visible.next(true);
    this.setTransparent(false);
  }
}
