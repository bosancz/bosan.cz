import { NgModule } from "@angular/core";
 
import { TypeaheadModule } from "ngx-bootstrap/typeahead";

@NgModule({
  imports: [
    TypeaheadModule.forRoot()
  ],
  declarations: [ ],
  exports: [
    TypeaheadModule
  ],
  providers: [ ]
  
})
export class AdminSharedModule { }
