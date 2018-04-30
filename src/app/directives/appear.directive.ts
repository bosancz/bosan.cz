import { Directive, Output, ElementRef, OnDestroy, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/startWith';

@Directive({
  selector: '[appear]'
})
export class AppearDirective implements OnDestroy {

  @Output()
  appear:EventEmitter<void> = new EventEmitter<void>();
  
  appeared:boolean = false;
  
  subscriptionScroll:Subscription;
  
  constructor(private element: ElementRef) { }

  ngOnInit(){
    this.subscriptionScroll = Observable.fromEvent(window, 'scroll').startWith(null)
      .subscribe(() => {

        if(!this.appeared) this.checkPosition();

      });
  }
  
  ngOnDestroy(){
    this.subscriptionScroll.unsubscribe();
  }
  
  checkPosition(){
    let elementTop = this.element.nativeElement.getBoundingClientRect().top;
    let windowHeight = window.innerHeight;
    
    if(elementTop < windowHeight && elementTop > 0) {
      this.appeared = true;
      this.appear.emit();
    }
  }
  
  getOffsetTop(element: any){
    let offsetTop = element.offsetTop || 0;
    if(element.offsetParent){
      offsetTop += this.getOffsetTop(element.offsetParent);
    }
    return offsetTop;
  }

}