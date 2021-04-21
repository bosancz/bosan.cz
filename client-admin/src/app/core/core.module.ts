/* ANGULAR */
import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeCs from '@angular/common/locales/cs';
import { APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
/* IONIC */
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

/* ERROR HANDLERS */
import { MainErrorHandler } from 'app/core/error-handlers/main.error-handler';
import { MaterialModule } from 'app/shared/modules/material.module';
import { SharedModule } from 'app/shared/shared.module';
/* ENVIRONMENT */
import { environment } from 'environments/environment';
/* COMPONENTS */
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
/* HTTP INTERCEPTORS */
import { WithCredentialsInterceptor } from "./http-interceptors/with-credentials.interceptor";
import { AclService } from './services/acl.service';
import { permissions } from 'app/config/permissions';


/* STARUP SCRIPTS */
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
    IonicModule.forRoot(),
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: MainErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: WithCredentialsInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'cs' },
  ],
})
export class CoreModule { }

