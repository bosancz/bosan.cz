import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAccountComponent } from './my-account.component';
import { MyAccountInfoComponent } from './my-account-info/my-account-info.component';
import { MyAccountNotificationsComponent } from './my-account-notifications/my-account-notifications.component';
import { MyAccountCredentialsComponent } from './my-account-credentials/my-account-credentials.component';
import { MyAccountAppComponent } from './my-account-app/my-account-app.component';

const routes: Routes = [
  {
    path: '', component: MyAccountComponent, data: { permission: "admin:account" },
    children: [
      { path: 'info', component: MyAccountInfoComponent },
      { path: 'notifikace', component: MyAccountNotificationsComponent },
      { path: 'prihlasovaci-udaje', component: MyAccountCredentialsComponent },
      { path: 'aplikace', component: MyAccountAppComponent },
      { path: '', redirectTo: "info", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }
