import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UrlTree } from '@angular/router';

export interface SecondaryMenuItem {
  path: string | any[],
  label: string
}

export interface ActionItem {
  type: "action" | "divider";
  label?: string;
  callback?: () => any;
  disabled?: boolean;
  class?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  visible = new BehaviorSubject(true);
  transparent = new BehaviorSubject(false);

  secondaryMenu = new Subject<SecondaryMenuItem[] | null>();

  actions = new Subject<ActionItem[]>();

  constructor() { }

  hide() {
    this.visible.next(false);
  }

  setTransparent(status: boolean) {
    this.transparent.next(status);
  }

  reset() {
    this.visible.next(true);
    this.transparent.next(false);

    this.secondaryMenu.next(null);
    this.actions.next(null);
  }

  setSecondaryMenu(menu: SecondaryMenuItem[]) {
    setTimeout(() => this.secondaryMenu.next(menu), 0);
  }

  setActions(actions: ActionItem[]) {
    setTimeout(() => this.actions.next(actions), 0);
  }
}
