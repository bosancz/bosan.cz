import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersViewComponent } from './members-view/members-view.component';
import { MembersListComponent } from './members-list/members-list.component';

const routes: Routes = [
  { path: ':member/:cat', component: MembersViewComponent },
  { path: ':member', redirectTo: ":member/osobni", pathMatch: "full" },
  { path: '', component: MembersListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
