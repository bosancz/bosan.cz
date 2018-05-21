import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastService } from "./services/toast.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(private injector: Injector){
  }
  
  handleError(err: Error) {
    
    const toastService = this.injector.get(ToastService);
    
    if (err instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        toastService.toast("Chybí připojení k internetu", "error");
      } else {
        toastService.toast("Chyba serveru: " + err.message, "error");
      }
    } else {
      toastService.toast("Nastala neočekávaná chyba :(", "error");
      console.error(err);
    }
  }
  
}