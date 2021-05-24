// @ts-nocheck
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular';
import { webConfigStructure } from "app/config/web-config";
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from "app/core/services/toast.service";
import { WebConfig } from "app/schema/web-config";
import { WebConfigStructureGroup, WebConfigStructureItem } from 'app/schema/web-config-structure';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { Observable } from "rxjs";





@Component({
  selector: 'bo-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.scss']
})
export class WebComponent implements OnInit, ViewWillEnter {

  config?: WebConfig;

  configStructure: any = webConfigStructure;

  viewJson: boolean = false;

  actions: Action[] = [
    {
      text: "Uložit",
      handler: () => this.saveConfig()
    }
  ];

  @ViewChild("configForm") form!: NgForm;

  constructor(
    private toastService: ToastService,
    private api: ApiService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.loadConfig();
  }

  async loadConfig() {
    this.config = await this.api.get<WebConfig>("config");
  }

  async saveConfig() {

    if (!this.form.valid) {
      this.toastService.toast("Nelze uložit, formulář není vyplněn správně.");
      return;
    }

    const data: WebConfig = this.form.value;

    await this.api.put("config", data, { responseType: "text" });

    this.toastService.toast("Uloženo.");

  }

  getConfigValue(category: WebConfigStructureGroup, item: WebConfigStructureItem): Observable<any> {
    return this.config?.[category.name]?.[item.name] || item.default;
  }

}
