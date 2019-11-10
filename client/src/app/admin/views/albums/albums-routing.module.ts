import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumsViewComponent } from './albums-view/albums-view.component';
import { AlbumsListComponent } from './albums-list/albums-list.component';

const routes: Routes = [
  { path: ':album/:cat', component: AlbumsViewComponent },
  { path: ':album', redirectTo: ":album/upravit", pathMatch: "full" },
  { path: '', component: AlbumsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
