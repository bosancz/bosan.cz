import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CodelistEditorComponent } from './components/codelist-editor/codelist-editor.component';
import { WebSettingsRoutingModule } from './web-routing.module';
import { WebComponent } from './web.component';


@NgModule({
  declarations: [
    WebComponent,
    CodelistEditorComponent
  ],
  imports: [
    CommonModule,
    WebSettingsRoutingModule,
    SharedModule,
  ]
})
export class WebModule { }
