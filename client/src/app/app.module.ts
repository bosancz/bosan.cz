import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from 'app/app.component';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppErrorHandler } from "app/app.errorhandler";
import { httpInterceptorProviders } from "app/core/http-interceptors";

import { ServiceWorkerModule } from '@angular/service-worker';

/* MODULES */
import { AppSharedModule } from "app/shared/app-shared.module";

// VIEWS
import { NotFoundComponent } from 'app/core/views/not-found/not-found.component';

// App Config
import { environment } from "environments/environment";

console.log("Angular is running in " + (environment.production ? "production" : "development") + " environment");

@NgModule({
  declarations: [
    AppComponent,

    /* VIEWS */
    NotFoundComponent,

  ],
  imports: [
    BrowserAnimationsModule,    
    AppRoutingModule,

    AppSharedModule,
    
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    /* Error Handlers */ { provide: ErrorHandler, useClass: AppErrorHandler },
    httpInterceptorProviders
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
