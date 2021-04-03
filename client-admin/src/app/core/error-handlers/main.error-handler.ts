import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from "environments/environment";

import { OnlineService } from "app/core/services/online.service";
import { ApiService } from "app/core/services/api.service";
import { Router } from '@angular/router';

@Injectable()
export class MainErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {

  }

  handleError(err: any) {

    const onlineService = this.injector.get(OnlineService);
    const api = this.injector.get(ApiService);
    const router = this.injector.get(Router);

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

      errorData.description = JSON.stringify(err.error, undefined, "  ");

      if (!onlineService.online.value) return; // dont report errors due to conenction loss

      if (err.status === 401) {
        router.navigate(["/login"]);
      }
      else if (err.status === 403) {
        reportError = false;
      }

      console.error(err);

    }
    else if (err.name === "GoogleError") {
      if (err.message === "idpiframe_initialization_failed") {
        console.error("Failed to initialize Google Services");
        reportError = false;
      }
      else console.error(err);
    }
    else {
      console.error(err);
    }

    if (reportError && environment.production) {
      api.post("errors", errorData).catch(err => console.error(err));
    }
  }

}