import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from "environments/environment";

import { ToastService } from "app/core/services/toast.service";
import { OnlineService } from "app/core/services/online.service";
import { ApiService } from "app/core/services/api.service";
import { RuntimeService } from "app/core/services/runtime.service";
import { UserService } from "app/core/services/user.service";

import { GoogleError } from "app/core/services/google.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {

  }

  handleError(err: any) {

    const toastService = this.injector.get(ToastService);
    const onlineService = this.injector.get(OnlineService);
    const runtimeService = this.injector.get(RuntimeService);
    const userService = this.injector.get(UserService);
    const api = this.injector.get(ApiService);

    if (err.promise && err.rejection) err = err.rejection;

    var reportError = true;

    const errorData = {
      message: err.message,
      status: err.status,
      description: err.description,
      stack: err.stack,
      url: window.location.href,
      navigator: navigator.userAgent,
      ng: {
        component: err.ngDebugContext && err.ngDebugContext.component ? err.ngDebugContext.component.constructor.name : undefined,
        environment: environment.production ? "production" : "development"
      }
    };
    
    if (err instanceof HttpErrorResponse) {
      
      errorData.description = JSON.stringify(err.error,undefined,"  ");

      if (!onlineService.online.value) return; // dont report errors due to conenction loss

      if (err.status === 401) {
        runtimeService.login(userService.userSnapshot);
        if(userService.userSnapshot) toastService.toast("Přihlášení vypršelo, přihlaste se znovu.", "error");
        else toastService.toast("K této akci musíte být přihlášeni.", "error");
      }
      else if (err.status === 403) {
        toastService.toast("K této akci nemáš oprávnění.", "error");
        reportError = false;
      }

      console.error(err);

    }
    else if(err.name === "GoogleError"){
      if(err.message === "idpiframe_initialization_failed"){
        console.error("Failed to initialize Google Services");    
        reportError = false;
      }
      else console.error(err);
    }
    else {      
      console.error(err);
    }

    if(reportError){
      api.post("errors", errorData).catch(err => console.error(err));
    }
  }

}