import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AppSharedModule } from "app/shared/app-shared.module";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";

/* Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';

/* COMPONENTS */
import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { GroupsSelectComponent } from './components/groups-select/groups-select.component';
import { MembersSelectComponent } from './components/members-select/members-select.component';
import { ListSliderComponent } from './components/list-slider/list-slider.component';
import { EventStatusBadgeComponent } from './components/event-status-badge/event-status-badge.component';
import { CodelistEditorComponent } from "./components/codelist-editor/codelist-editor.component";
import { ContactsEditorComponent } from "./components/contacts-editor/contacts-editor.component";
import { PhotoTagsEditorComponent } from "./components/photo-tags-editor/photo-tags-editor.component";
import { TypeaheadFieldComponent } from "./components/typeahead-field/typeahead-field.component";
import { EventCardComponent } from './components/event-card/event-card.component';
import { ActionMenuDirective } from './directives/action-menu.directive';
import { PageTitleDirective } from './directives/page-title.directive';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PhotoFaceComponent } from './components/photo-face/photo-face.component';

@NgModule({
  imports: [
    AppSharedModule,
    TypeaheadModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    /* Angular Material */
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatBadgeModule,
    MatSelectModule,

  ],
  declarations: [
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent,
    EventStatusBadgeComponent,

    CodelistEditorComponent,
    ContactsEditorComponent,
    PhotoTagsEditorComponent,
    TypeaheadFieldComponent,
    EventCardComponent,
    PageHeaderComponent,
    PhotoFaceComponent,

    /* DIRECTIVES */
    ActionMenuDirective,
    PageTitleDirective,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    /* Angular Material */
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatBadgeModule,
    MatSelectModule,

    TypeaheadModule,

    /* COMPONENTS */
    AdminTableComponent,
    GroupsSelectComponent,
    MembersSelectComponent,
    ListSliderComponent,
    EventStatusBadgeComponent,

    CodelistEditorComponent,
    ContactsEditorComponent,
    PhotoTagsEditorComponent,
    TypeaheadFieldComponent,
    EventCardComponent,
    PageHeaderComponent,
    PhotoFaceComponent,

    /* DIRECTIVES */
    ActionMenuDirective,
    PageTitleDirective,
  ],
  providers: []

})
export class AdminSharedModule { }
