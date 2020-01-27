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
    setTimeout(() => this.visible.next(false), 0);
  }

  setTransparent(status: boolean) {
    setTimeout(() => this.transparent.next(status), 0);
  }

  reset() {
    this.visible.next(true);
    this.setTransparent(false);

    this.secondaryMenu.next(null);
    this.actions.next(null);
  }

  setActions(actions: ActionItem[]) {
    setTimeout(() => this.actions.next(actions), 0);
  }
}
