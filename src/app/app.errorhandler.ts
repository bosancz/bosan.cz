import { ErrorHandler, Injectable, Injector, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastService } from "./services/toast.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(private injector:Injector){
  }

  handleError(err:any) {

    const toastService = this.injector.get(ToastService);
    
    if(err.promise && err.rejection) err = err.rejection;
    
    if (err instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        toastService.toast("Chybí připojení k internetu", "error");
      } else if(err.status === 401) {
        toastService.toast("K načtení některých dat na této stránce nemáte oprávnění.", "error");
      } else {
        toastService.toast("Chyba serveru: " + err.message, "error");
      }
    } else if(err.message && err.message.match("Cannot match any routes")) {
      toastService.toast("Tato stránka neexistuje.", "error");
      console.error({err});
    } else {
      toastService.toast("Nastala neočekávaná chyba :(", "error");
      console.error({err});
    }
  }

}