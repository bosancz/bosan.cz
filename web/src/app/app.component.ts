import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FooterService } from "app/services/footer.service";
import { MenuService } from "app/services/menu.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "bo-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterContentInit {
  isTop: boolean;
  scrollbarWidth: number;
  menuCollapsed: boolean = true;

  @ViewChild("content", { static: true }) contentEl: ElementRef<HTMLDivElement>;

  constructor(public menuService: MenuService, public footerService: FooterService, private http: HttpClient) {}

  ngAfterContentInit() {
    window.addEventListener("scroll", () => this.updateTop());
    this.updateTop();

    // this.modalService.show(PourFeliciterComponent, { class: 'modal-lg' });

    this.logVersion();
  }

  updateTop() {
    this.isTop = window.pageYOffset === 0;
  }

  async logVersion() {
    try {
      const manifestJson = await firstValueFrom(this.http.get<any>("/manifest.json"));
      console.log(manifestJson.name);
    } catch {
      console.warn("Missing manifest file");
    }
  }
}
