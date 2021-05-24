import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountAppComponent } from './components/account-app/account-app.component';
import { AccountCredentialsComponent } from './components/account-credentials/account-credentials.component';
import { AccountNotificationsComponent } from './components/account-notifications/account-notifications.component';


@NgModule({
  declarations: [
    AccountComponent,
    AccountAppComponent,
    AccountCredentialsComponent,
    AccountNotificationsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
  ],
})
export class AccountModule { }
