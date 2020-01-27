import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MenuService } from 'app/core/services/menu.service';
import { FooterService } from 'app/core/services/footer.service';

@Component({
  selector: 'frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent implements AfterViewInit {

  isTop: boolean;
  scrollbarWidth: number;
  menuCollapsed: boolean = true;

  @ViewChild("content", { static: true }) contentEl: ElementRef<HTMLDivElement>;

  constructor(public menuService: MenuService, public footerService: FooterService) { }

  ngAfterViewInit() {
    setTimeout(() => this.updateTop(), 0);
    this.scrollbarWidth = this.contentEl.nativeElement.offsetWidth - this.contentEl.nativeElement.clientWidth;
  }

  updateTop() {
    this.isTop = (this.contentEl.nativeElement.scrollTop === 0);
  }

}
