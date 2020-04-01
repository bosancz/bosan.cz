import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsListComponent } from './errors-list/errors-list.component';
import { ErrorsViewComponent } from './errors-view/errors-view.component';

@NgModule({
  declarations: [
    ErrorsListComponent,
    ErrorsViewComponent
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule { }
