import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';
import { AppSharedModule } from 'app/shared/app-shared.module';

import { MembersRoutingModule } from './members-routing.module';

import { MembersListComponent } from './members-list/members-list.component';
import { MembersViewComponent } from './members-view/members-view.component';
import { MembersEditComponent } from './members-edit/members-edit.component';
import { MembersCreateComponent } from './members-create/members-create.component';


@NgModule({
  declarations: [
    MembersListComponent,
    MembersViewComponent,
    MembersEditComponent,
    MembersCreateComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    AppSharedModule,
    AdminSharedModule
  ]
})
export class MembersModule { }
