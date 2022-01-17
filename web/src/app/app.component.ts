import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FooterService } from 'app/services/footer.service';
import { MenuService } from 'app/services/menu.service';

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
    public footerService: FooterService,
    // private modalService: BsModalService
  ) { }

  ngAfterViewInit() {
    window.addEventListener("scroll", () => this.updateTop());
    this.updateTop();

    // this.modalService.show(PourFeliciterComponent, { class: 'modal-lg' });
  }

  updateTop() {
    this.isTop = (window.pageYOffset === 0);
  }

}
