// @ts-nocheck
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';

import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

import { ConfigService } from "app/core/services/config.service";
import { ToastService } from "app/core/services/toast.service";

import { WebConfig } from "app/schema/web-config";
import { WebConfigStructureGroup, WebConfigStructureItem } from 'app/schema/web-config-structure';

import { webConfigStructure } from "app/config/web-config";
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';

@Component({
  selector: 'bo-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.scss']
})
export class WebComponent implements OnInit {

  config$ = this.configService.config;

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
    private configService: ConfigService,
    private toastService: ToastService
  ) { }

  ngOnInit() {

  }

  async saveConfig() {

    if (!this.form.valid) {
      this.toastService.toast("Nelze uložit, formulář není vyplněn správně.");
      return;
    }

    const data: WebConfig = this.form.value;

    await this.configService.saveConfig(data);

    this.toastService.toast("Uloženo.");

  }

  getConfigValue(category: WebConfigStructureGroup, item: WebConfigStructureItem): Observable<any> {
    return this.config$.pipe(map(config => (config[category.name] && config[category.name][item.name]) || item.default));
  }

}
