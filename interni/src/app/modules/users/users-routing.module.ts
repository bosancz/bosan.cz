import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersListComponent } from './users-list/users-list.component';
import { UsersViewComponent } from './users-view/users-view.component';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';

const routes: Routes = [
  { path: 'vytvorit', component: UsersCreateComponent },

  { path: ':user', component: UsersViewComponent },

  { path: ':user/upravit', component: UsersEditComponent },

  { path: '', component: UsersListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
