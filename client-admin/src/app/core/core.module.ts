/* ANGULAR */
import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeCs from '@angular/common/locales/cs';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
/* ERROR HANDLERS */
import { MainErrorHandler } from 'app/core/error-handlers/main.error-handler';
import { MaterialModule } from 'app/shared/modules/material/material.module';
import { SharedModule } from 'app/shared/shared.module';
/* ENVIRONMENT */
import { environment } from 'environments/environment';
import { version } from "../../../package.json";
/* COMPONENTS */
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
/* HTTP INTERCEPTORS */
import { WithCredentialsInterceptor } from "./http-interceptors/with-credentials.interceptor";


/* STARUP SCRIPTS */
console.log("Bošán interní sekce", {
  version,
  environment: (environment.production ? "production" : "development"),
  locale: "cs"
});

registerLocaleData(localeCs, 'cs');


@NgModule({
  declarations: [
    NotFoundComponent,
    LoginComponent,
    AdminMenuComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    ServiceWorkerModule,
    NotFoundComponent,
    LoginComponent,
    AdminMenuComponent,
  ],
  providers: [
    { provide: ErrorHandler, useClass: MainErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: WithCredentialsInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'cs' },
  ],
})
export class CoreModule { }

