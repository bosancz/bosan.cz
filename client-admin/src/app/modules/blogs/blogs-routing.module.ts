import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsEditComponent } from './views/blogs-edit/blogs-edit.component';
import { BlogsListComponent } from './views/blogs-list/blogs-list.component';
import { BlogsViewComponent } from './views/blogs-view/blogs-view.component';

const routes: Routes = [
  { path: "", component: BlogsListComponent },
  { path: ":id/upravit", component: BlogsEditComponent },
  { path: ":id", component: BlogsViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
