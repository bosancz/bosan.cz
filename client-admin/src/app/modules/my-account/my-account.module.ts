import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { MyAccountCredentialsComponent } from './components/my-account-credentials/my-account-credentials.component';
import { MyAccountAppComponent } from './components/my-account-app/my-account-app.component';
import { MyAccountNotificationsComponent } from './components/my-account-notifications/my-account-notifications.component';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountComponent } from './my-account.component';


@NgModule({
  declarations: [
    MyAccountComponent,
    MyAccountAppComponent,
    MyAccountCredentialsComponent,
    MyAccountNotificationsComponent
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    SharedModule,
  ],
})
export class MyAccountModule { }
