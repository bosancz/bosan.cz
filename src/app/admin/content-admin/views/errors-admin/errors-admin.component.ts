import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";

import { ReportedError } from "app/schema/reported-error";

@Component({
  selector: 'errors-admin',
  templateUrl: './errors-admin.component.html',
  styleUrls: ['./errors-admin.component.css']
})
export class ErrorsAdminComponent implements OnInit, OnDestroy {

  errors:ReportedError[] = [];
  
  view:string = "week";
  
  views:{[view:string]:any} = {
    "week": { from: new Date((new Date()).getDate() - 7) },
    "all": { from: undefined }
  }
  
  paramsSubscription:Subscription;
  
  constructor(private api:ApiService, private route:ActivatedRoute) { }

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
    this.errors = await this.api.get<ReportedError[]>("errors", view);
  }

}
