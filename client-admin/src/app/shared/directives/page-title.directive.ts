import { Directive, ElementRef, Input, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { TitleService } from 'app/core/services/title.service';

@Directive({
  selector: '[pageTitle]'
})
export class PageTitleDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input() pageTitle!: string;

  observer?: MutationObserver;

  constructor(
    private el: ElementRef<HTMLElement>,
    private titleService: TitleService
  ) { }

  updateTitle() {
    this.titleService.setPageTitle(this.pageTitle || this.el.nativeElement.textContent);
  }

  ngAfterViewInit() {
    this.observer = new MutationObserver(records => {
      if (records.some(item => item.type === "characterData")) this.updateTitle();
    });

    this.observer.observe(this.el.nativeElement, { characterData: true, subtree: true });
  }

  ngOnChanges() {
    this.updateTitle();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.titleService.setPageTitle(null);
  }

}
