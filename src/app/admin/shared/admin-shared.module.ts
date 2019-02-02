import { NgModule } from "@angular/core";
 
import { AppSharedModule } from "app/shared/app-shared.module";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";

import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { GroupsSelectComponent } from './components/groups-select/groups-select.component';
import { MembersSelectComponent } from './components/members-select/members-select.component';
import { ListSliderComponent } from './components/list-slider/list-slider.component';

@NgModule({
  imports: [
    AppSharedModule,
    TypeaheadModule.forRoot()
  ],
  declarations: [
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent
  ],
  exports: [
    TypeaheadModule,
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent
  ],
  providers: [ ]
  
})
export class AdminSharedModule { }
