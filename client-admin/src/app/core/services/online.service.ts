import { Injectable } from '@angular/core';

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  online: BehaviorSubject<boolean> = new BehaviorSubject(window.navigator.onLine);

  constructor() {
    this.watch();
  }

  watch() {
    window.addEventListener('offline', (e) => {
      this.online.next(false);
    });

    window.addEventListener('online', (e) => {
      this.online.next(true);
    });
  }
}
