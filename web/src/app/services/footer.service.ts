import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  visible = new BehaviorSubject<boolean>(true);

  constructor() { }

  hide(){
    this.visible.next(false);
  }

  show(){
    this.visible.next(true);
  }

  reset(){
    this.visible.next(true);
  }

}
