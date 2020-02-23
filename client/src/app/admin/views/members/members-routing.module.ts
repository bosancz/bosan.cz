import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersViewComponent } from './members-view/members-view.component';
import { MembersListComponent } from './members-list/members-list.component';
import { MembersEditComponent } from './members-edit/members-edit.component';

const routes: Routes = [
  { path: ':member/upravit', component: MembersEditComponent },
  { path: ':member', component: MembersViewComponent },
  { path: '', component: MembersListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
