import { Component, OnInit, Inject } from '@angular/core';
import { SwUpdate } from "@angular/service-worker";

import { RuntimeService } from "app/core/services/runtime.service";
import { OnlineService } from "app/core/services/online.service";
import { ToastService, Toast } from "app/core/services/toast.service";
import { MenuService } from './core/services/menu.service';
import { FooterService } from './core/services/footer.service';


@Component({
  selector: 'bosan-app',
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit {

  toasts: Toast[] = [];

  isScrollTop: boolean;

  constructor(
    runtime: RuntimeService,
    private toastService: ToastService,
    public menuService: MenuService,
    public footerService: FooterService,
    public onlineService: OnlineService,
    public swUpdate: SwUpdate
  ) {
    runtime.init();
  }

  ngOnInit() {
    this.toastService.toasts.subscribe((toast: Toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.toasts.shift(), 2000);
    });
  }

  clearToasts() {
    this.toasts = [];
  }

  reload() {
    window.location.reload();
  }
}
