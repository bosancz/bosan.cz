import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSettingsRoutingModule } from './web-settings-routing.module';
import { WebSettingsComponent } from './web-settings.component';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

@NgModule({
  declarations: [
    WebSettingsComponent
  ],
  imports: [
    CommonModule,
    WebSettingsRoutingModule,
    AdminSharedModule
  ]
})
export class WebSettingsModule { }
