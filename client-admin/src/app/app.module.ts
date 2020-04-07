import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from "./app.errorhandler";

/* HTTP INTERCEPTOR */
import { httpInterceptorProviders } from "app/http-interceptors";

/* SERVICE WORKER */
import { ServiceWorkerModule } from '@angular/service-worker';

/* MODULES */
import { SharedModule } from "app/shared/shared.module";

// VIEWS
import { NotFoundComponent } from 'app/views/not-found/not-found.component';
import { CanalRegistrationComponent } from './views/canal-registration/canal-registration.component';
import { DocumentsViewComponent } from './views/documents-view/documents-view.component';
import { LoginComponent } from './views/login/login.component';

// COMPONENTS
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';

// Locale
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';

// App Config
import { environment } from "environments/environment";

console.log("Angular is running in " + (environment.production ? "production" : "development") + " environment");

registerLocaleData(localeCs, 'cs');

@NgModule({
  declarations: [
    AppComponent,

    /* VIEWS */
    NotFoundComponent,
    CanalRegistrationComponent,
    DocumentsViewComponent,
    LoginComponent,

    /* COMPONENTS */
    AdminMenuComponent,

  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,

    SharedModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: LOCALE_ID, useValue: 'cs' },
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
