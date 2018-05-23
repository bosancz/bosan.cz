import { Directive, Output, ElementRef, OnDestroy, EventEmitter } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { startWith } from "rxjs/operators";



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
    this.subscriptionScroll = fromEvent(window, 'scroll').pipe(startWith(null))
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