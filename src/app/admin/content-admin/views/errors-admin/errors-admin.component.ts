import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";

import { ReportedError } from "app/core/schema/reported-error";

@Component({
  selector: 'errors-admin',
  templateUrl: './errors-admin.component.html',
  styleUrls: ['./errors-admin.component.scss']
})
export class ErrorsAdminComponent implements OnInit, OnDestroy {

  errors:ReportedError[] = [];

  view:string = "week";

  views:{[view:string]:any};

  paramsSubscription:Subscription;

  constructor(private api:ApiService, private route:ActivatedRoute, private toastService:ToastService) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    this.views = {
      "week": { from: weekAgo.toISOString() },
      "older": { till: weekAgo.toISOString() }
    };
  }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.view = (params.view && !!this.views[params.view]) ? params.view : "week";
      this.loadErrors(this.views[this.view]);
    });

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadErrors(view){
    if(!view) return;
    this.errors = await this.api.get<ReportedError[]>("errors", view);
  }
  
  async deleteErrors(){
    await this.api.delete("errors");
    await this.loadErrors(this.views[this.view]);
    this.toastService.toast("Všechny chyby byly smazány.");
  }

}
