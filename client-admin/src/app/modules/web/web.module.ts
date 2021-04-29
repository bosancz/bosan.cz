import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WebSettingsRoutingModule } from './web-routing.module';
import { WebComponent } from './web.component';


@NgModule({
  declarations: [
    WebComponent
  ],
  imports: [
    CommonModule,
    WebSettingsRoutingModule,
    SharedModule,
  ]
})
export class WebModule { }
