import { Directive, ElementRef, Input } from '@angular/core';
import { TitleService } from 'app/core/services/title.service';

@Directive({
  selector: '[pageTitle]'
})
export class PageTitleDirective {

  @Input() pageTitle: string;

  constructor(
    private el: ElementRef<HTMLElement>,
    private titleService: TitleService
  ) { }

  ngAfterViewInit() {
    this.titleService.setPageTitle(this.pageTitle || this.el.nativeElement.innerText);
  }

  ngOnDestroy() {
    this.titleService.setPageTitle(null);
  }

}
