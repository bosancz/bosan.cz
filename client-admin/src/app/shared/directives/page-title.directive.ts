import { Directive, ElementRef, Input, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { TitleService } from 'app/services/title.service';

@Directive({
  selector: '[pageTitle]'
})
export class PageTitleDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input() pageTitle: string;

  constructor(
    private el: ElementRef<HTMLElement>,
    private titleService: TitleService
  ) { }

  updateTitle(){
    this.titleService.setPageTitle(this.pageTitle || this.el.nativeElement.innerText);
  }

  ngAfterViewInit() {
    this.updateTitle();
  }

  ngOnChanges(){
    this.updateTitle();
  }

  ngOnDestroy() {
    this.titleService.setPageTitle(null);
  }

}
