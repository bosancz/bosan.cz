import { NgModule } from "@angular/core";
 
import { TypeaheadModule } from "ngx-bootstrap/typeahead";

import { AdminTableComponent } from '../components/admin-table/admin-table.component';

@NgModule({
  imports: [
    TypeaheadModule.forRoot()
  ],
  declarations: [AdminTableComponent],
  exports: [
    TypeaheadModule,
    AdminTableComponent
  ],
  providers: [ ]
  
})
export class AdminSharedModule { }
