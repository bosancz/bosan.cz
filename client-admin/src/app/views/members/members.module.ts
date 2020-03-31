import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';


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
    
    SharedModule
  ]
})
export class MembersModule { }
