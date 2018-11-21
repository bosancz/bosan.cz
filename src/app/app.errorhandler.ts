import { ErrorHandler, Injectable, Injector, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from "../environments/environment";

import { ToastService } from "./services/toast.service";
import { OnlineService } from "./services/online.service";
import { ApiService } from "./services/api.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {
    
  }

  handleError(err: any) {

    const toastService = this.injector.get(ToastService);
    const onlineService = this.injector.get(OnlineService);
    const api = this.injector.get(ApiService);

    if (err.promise && err.rejection) err = err.rejection;

    const errorData = {
      message: err.message,
      status: err.status,
      description: err.description,
      stack: err.stack,
      url: window.location.href,
      ng: {}
    };

    if (err instanceof HttpErrorResponse) {
      
      errorData.description = JSON.stringify(err.error,undefined,"  ");
      
      // Server or connection error happened
      if (!onlineService.online.value) return;
      
      if (err.status === 401) {
        toastService.toast("K této akci nemáte oprávnění.", "error");
      } else {
        toastService.toast("Chyba serveru: " + err.message, "error");
      }

    } else {
      toastService.toast("Nastala neočekávaná chyba :(", "error"); // TODO: message as a config
    }
    
    console.error(err);

    if(err.ngDebugContext){
      errorData.ng = {
        component: err.ngDebugContext.component ? err.ngDebugContext.component.constructor.name : undefined,
        environment: environment.production ? "production" : "development"
      }
    }

    api.post("errors", errorData)
      .then(() => toastService.toast("Zpráva o chybě byla zaznamenána."))
      .catch(err => console.error(err));
  }

}