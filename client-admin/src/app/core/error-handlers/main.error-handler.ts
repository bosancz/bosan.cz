import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OnlineService } from "app/core/services/online.service";
import { ErrorData } from 'app/schema/error';
import { environment } from "environments/environment";
import { ToastService } from '../services/toast.service';


@Injectable()
export class MainErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {

  }

  handleError(err: any) {

    const onlineService = this.injector.get(OnlineService);
    const navController = this.injector.get(NavController);
    const toastService = this.injector.get(ToastService);

    if (err.promise && err.rejection) err = err.rejection;

    var propagateError = true;

    const errorData: ErrorData = {
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

      errorData.description = JSON.stringify(err.error, undefined, "  ");

      // dont report errors due to connection loss
      if (!onlineService.online.value) {
        toastService.toast("Akci se nepodařilo dokončit - jsi bez internetu.");
        return;
      }

      if (err.status === 401) {
        const queryParams = {
          return_url: window.location.pathname
        };
        navController.navigateRoot("/login", { queryParams });
      }
      else if (err.status === 403) {
        toastService.toast("K akci nemáš oprávnění.");
        propagateError = false;
      }

    }

    else if (err.name === "GoogleError") {
      if (err.message === "idpiframe_initialization_failed") {
        errorData.message = "Failed to initialize Google Services";
        propagateError = false;
      }
    }

    console.error("Error", err);
    console.error("ErrorData", errorData);


    if (propagateError) {
      // TODO: open modal or page to propagate error to the user and enable reporting
    }
  }

}