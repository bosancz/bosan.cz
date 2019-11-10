import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorsListComponent } from './errors-list/errors-list.component';
import { ErrorsViewComponent } from './errors-view/errors-view.component';

const routes: Routes = [
  { path: '', component: ErrorsListComponent },
  { path: ':id', component: ErrorsViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorsRoutingModule { }
