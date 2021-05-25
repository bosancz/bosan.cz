/* ANGULAR */
import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeCs from '@angular/common/locales/cs';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
/* IONIC */
import { IonicModule, IonicRouteStrategy, isPlatform } from "@ionic/angular";
/* ERROR HANDLERS */
import { MainErrorHandler } from 'app/core/error-handlers/main.error-handler';
/* MODULES */
import { SharedModule } from 'app/shared/shared.module';
/* ENVIRONMENT */
import { environment } from 'environments/environment';
/* COMPONENTS */
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
/* HTTP INTERCEPTORS */
import { WithCredentialsInterceptor } from "./http-interceptors/with-credentials.interceptor";
/* VIEWS */
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';



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
    IonicModule.forRoot({
      backButtonText: isPlatform('ios') ? 'Zpět' : ''
    }),
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

