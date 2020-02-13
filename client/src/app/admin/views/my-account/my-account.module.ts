import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyAccountRoutingModule } from './my-account-routing.module';

import { MyAccountComponent } from './my-account.component';

import { MyAccountCredentialsComponent } from './my-account-credentials/my-account-credentials.component';
import { MyAccountInfoComponent } from './my-account-info/my-account-info.component';
import { MyAccountNotificationsComponent } from './my-account-notifications/my-account-notifications.component';
import { MyAccountAppComponent } from './my-account-app/my-account-app.component';
import { AppSharedModule } from 'app/shared/app-shared.module';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

@NgModule({
  declarations: [
    MyAccountComponent,
    MyAccountAppComponent,
    MyAccountCredentialsComponent,
    MyAccountInfoComponent,
    MyAccountNotificationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    
    AppSharedModule,
    AdminSharedModule,
    
    MyAccountRoutingModule,
  ]
})
export class MyAccountModule { }
