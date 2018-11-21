import { Injectable } from '@angular/core';

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  online:BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() {
    this.watch();
  }

  watch(){
    window.addEventListener('offline', (e) => {
      this.online.next(false);
      console.log("online",false);
    });
    
    window.addEventListener('online', (e) => {
      this.online.next(true);
      console.log("online",true);
    });
  }
}
