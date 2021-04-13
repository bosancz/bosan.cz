import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSettingsRoutingModule } from './web-routing.module';
import { WebComponent } from './web.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialModule } from 'app/shared/material.module';

@NgModule({
  declarations: [
    WebComponent
  ],
  imports: [
    CommonModule,
    WebSettingsRoutingModule,
    SharedModule,
    MaterialModule,
  ]
})
export class WebModule { }
