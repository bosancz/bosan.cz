import { NgModule } from "@angular/core";
 
import { AppSharedModule } from "app/modules/app-shared.module";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";

import { AdminTableComponent } from '../components/admin-table/admin-table.component';
import { GroupsSelectComponent } from '../components/groups-select/groups-select.component';
import { MembersSelectComponent } from '../components/members-select/members-select.component';

@NgModule({
  imports: [
    AppSharedModule,
    TypeaheadModule.forRoot()
  ],
  declarations: [
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent
  ],
  exports: [
    TypeaheadModule,
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent
  ],
  providers: [ ]
  
})
export class AdminSharedModule { }
