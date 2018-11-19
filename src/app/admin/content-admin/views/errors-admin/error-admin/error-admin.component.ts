import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from "app/services/api.service";

import { ReportedError } from "app/schema/reported-error";

@Component({
  selector: 'error-admin',
  templateUrl: './error-admin.component.html',
  styleUrls: ['./error-admin.component.css']
})
export class ErrorAdminComponent implements OnInit, OnDestroy {

  error:ReportedError;

  paramsSubscription:Subscription;

  constructor(private api:ApiService, private route:ActivatedRoute) { }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.loadError(params.chyba);
    });

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadError(errorId:string){
    this.error = await this.api.get<ReportedError>("errors", {_id:errorId});
  }

}
