import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersViewComponent } from './users-view/users-view.component';



@NgModule({
  declarations: [
    UsersViewComponent,
    UsersListComponent,
    UsersCreateComponent,
    UsersEditComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,

    SharedModule,
  ]
})
export class UsersModule { }
