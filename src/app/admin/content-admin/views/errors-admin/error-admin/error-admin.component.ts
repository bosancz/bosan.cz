import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { ApiService } from "app/core/services/api.service";
import { ToastService } from "app/core/services/toast.service";

import { ReportedError, ReportedErrorInstance } from "app/shared/schema/reported-error";

@Component({
  selector: 'error-admin',
  templateUrl: './error-admin.component.html',
  styleUrls: ['./error-admin.component.css']
})
export class ErrorAdminComponent implements OnInit, OnDestroy {

  error:ReportedError;
  currentInstance:ReportedErrorInstance;
  
  paramsSubscription:Subscription;

  constructor(private api:ApiService, private route:ActivatedRoute, private router:Router, private toastService:ToastService) { }

  ngOnInit() {

    this.paramsSubscription = this.route.params.subscribe((params:Params) => {
      this.loadError(params.chyba);
    });

  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadError(errorId:string){
    this.error = await this.api.get<ReportedError>(["error",errorId]);
    this.currentInstance = this.error.instances[0];
  }
  
  async deleteError(){
    await this.api.delete(this.error._links.self);
    this.router.navigate(["../"],{relativeTo: this.route});
    this.toastService.toast("Chyba smazána.");
  }

}
