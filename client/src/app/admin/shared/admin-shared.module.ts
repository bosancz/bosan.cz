import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
 
import { AppSharedModule } from "app/shared/app-shared.module";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";

import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { GroupsSelectComponent } from './components/groups-select/groups-select.component';
import { MembersSelectComponent } from './components/members-select/members-select.component';
import { ListSliderComponent } from './components/list-slider/list-slider.component';
import { EventStatusBadgeComponent } from './components/event-status-badge/event-status-badge.component';
import { MemberInfoModalComponent } from '../../shared/modals/member-info-modal/member-info-modal.component';
import { CodelistEditorComponent } from "./components/codelist-editor/codelist-editor.component";
import { ContactsEditorComponent } from "./components/contacts-editor/contacts-editor.component";
import { PhotoTagsEditorComponent } from "./components/photo-tags-editor/photo-tags-editor.component";
import { TypeaheadFieldComponent } from "./components/typeahead-field/typeahead-field.component";

@NgModule({
  imports: [    
    AppSharedModule,
    TypeaheadModule.forRoot(),
    FormsModule
  ],
  declarations: [
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent,
    EventStatusBadgeComponent,
    //MemberInfoModalComponent

    CodelistEditorComponent,
    ContactsEditorComponent,
    PhotoTagsEditorComponent,
    TypeaheadFieldComponent
  ],
  exports: [
    FormsModule,
    
    TypeaheadModule,
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent,
    EventStatusBadgeComponent,
    //MemberInfoModalComponent   
    
    CodelistEditorComponent,
    ContactsEditorComponent,
    PhotoTagsEditorComponent,
    TypeaheadFieldComponent
  ],
  providers: [ ]
  
})
export class AdminSharedModule { }
