import { Component, OnInit } from '@angular/core';
import { SwUpdate } from "@angular/service-worker";

import { RuntimeService } from "app/core/services/runtime.service";
import { LayoutService } from "app/core/services/layout.service";
import { OnlineService } from "app/core/services/online.service";
import { ToastService, Toast } from "app/core/services/toast.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CovidWarningComponent } from './core/components/covid-warning/covid-warning.component';


@Component({
  selector: 'bosan-app',
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit {

  toasts: Toast[] = [];

  constructor(
    runtime: RuntimeService,
    private toastService: ToastService,
    public onlineService: OnlineService,
    public layoutService: LayoutService,
    public swUpdate: SwUpdate,
    private modalService: BsModalService
  ) {
    runtime.init();
  }

  ngOnInit() {
    this.toastService.toasts.subscribe((toast: Toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.toasts.shift(), 2000);
    });

    this.modalService.show(CovidWarningComponent);
  }

  clearToasts() {
    this.toasts = [];
  }

  reload() {
    window.location.reload();
  }
}
