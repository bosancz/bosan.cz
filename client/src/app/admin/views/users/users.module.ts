import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersViewComponent } from './users-view/users-view.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AppSharedModule } from 'app/shared/app-shared.module';
import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';

@NgModule({
  declarations: [
    UsersViewComponent,
    UsersListComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    AppSharedModule,
    AdminSharedModule
  ]
})
export class UsersModule { }
