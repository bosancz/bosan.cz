import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsCreateComponent } from './views/blogs-create/blogs-create.component';
import { BlogsEditComponent } from './views/blogs-edit/blogs-edit.component';
import { BlogsListComponent } from './views/blogs-list/blogs-list.component';

const routes: Routes = [
  { path: "", component: BlogsListComponent },
  { path: "vytvorit", component: BlogsCreateComponent },
  { path: ":id/upravit", component: BlogsEditComponent },
  { path: ":id", pathMatch: "full", redirectTo: ":id/upravit" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
