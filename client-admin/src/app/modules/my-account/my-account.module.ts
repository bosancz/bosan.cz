import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyAccountRoutingModule } from './my-account-routing.module';

import { MyAccountComponent } from './my-account.component';

import { MyAccountCredentialsComponent } from './my-account-credentials/my-account-credentials.component';
import { MyAccountInfoComponent } from './my-account-info/my-account-info.component';
import { MyAccountNotificationsComponent } from './my-account-notifications/my-account-notifications.component';
import { MyAccountAppComponent } from './my-account-app/my-account-app.component';

import { SharedModule } from 'app/shared/shared.module';
import { MaterialModule } from 'app/shared/material.module';

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
    MyAccountRoutingModule,
    SharedModule,
    MaterialModule,
  ]
})
export class MyAccountModule { }
