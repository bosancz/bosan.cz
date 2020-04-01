import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersViewComponent } from './users-view/users-view.component';
import { UsersListComponent } from './users-list/users-list.component';

import { SharedModule } from 'app/shared/shared.module';
import { UsersCreateComponent } from './users-create/users-create.component';

@NgModule({
  declarations: [
    UsersViewComponent,
    UsersListComponent,
    UsersCreateComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    
    SharedModule
  ]
})
export class UsersModule { }
