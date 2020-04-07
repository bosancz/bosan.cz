import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, LOCALE_ID, Inject } from '@angular/core';
import { MenuService } from 'app/services/menu.service';
import { FooterService } from 'app/services/footer.service';

@Component({
  selector: 'bo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  isTop: boolean;
  scrollbarWidth: number;
  menuCollapsed: boolean = true;

  @ViewChild("content", { static: true }) contentEl: ElementRef<HTMLDivElement>;

  constructor(
    public menuService: MenuService,
    public footerService: FooterService
  ) { }

  ngAfterViewInit() {
    setTimeout(() => this.updateTop(), 0);
    this.scrollbarWidth = this.contentEl.nativeElement.offsetWidth - this.contentEl.nativeElement.clientWidth;
  }

  updateTop() {
    this.isTop = (this.contentEl.nativeElement.scrollTop === 0);
  }

}
