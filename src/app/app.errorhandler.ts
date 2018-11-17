import { ErrorHandler, Injectable, Injector, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from "../environments/environment";

import { ToastService } from "./services/toast.service";
import { ApiService } from "./services/api.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {}

  handleError(err: any) {

    const toastService = this.injector.get(ToastService);
    const api = this.injector.get(ApiService);

    if (err.promise && err.rejection) err = err.rejection;

    if (err instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        toastService.toast("Chybí připojení k internetu", "error");
      } else if (err.status === 401) {
        toastService.toast("K této akci nemáte oprávnění.", "error");
      } else {
        toastService.toast("Chyba serveru: " + err.message, "error");
      }
      console.error(err);
    } else {
      toastService.toast("Nastala neočekávaná chyba :(", "error"); // TODO: message as a config
      console.error({err});
    }

    const errorData = {
      message: err.message,
      status: err.status,
      stack: err.stack,
      url: window.location.href,
      ng: {}
    };
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