import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from "app/shared/app-shared.module";
import { AdminSharedModule } from "app/admin/shared/admin-shared.module";

/* MAIN */
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';

/* MODALS */
import { CanalRegistrationComponent } from './views/canal-registration/canal-registration.component';
import { DocumentsViewComponent } from './views/documents-view/documents-view.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { LoginComponent } from './views/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,

    AppSharedModule,
    AdminSharedModule
  ],
  declarations: [
    AdminComponent,

    /* COMPONENTS */
    AdminMenuComponent,

    /* VIEWS */
    CanalRegistrationComponent,
    DocumentsViewComponent,
    LoginComponent

  ],
  entryComponents: []
})
export class AdminModule { }
