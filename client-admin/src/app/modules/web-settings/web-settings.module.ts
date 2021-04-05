import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSettingsRoutingModule } from './web-settings-routing.module';
import { WebSettingsComponent } from './web-settings.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialModule } from 'app/shared/material.module';

@NgModule({
  declarations: [
    WebSettingsComponent
  ],
  imports: [
    CommonModule,
    WebSettingsRoutingModule,
    SharedModule,
    MaterialModule,
  ]
})
export class WebSettingsModule { }
