import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumsCreateComponent } from './views/albums-create/albums-create.component';
import { AlbumsEditComponent } from './views/albums-edit/albums-edit.component';
import { AlbumsListComponent } from './views/albums-list/albums-list.component';
import { AlbumsViewInfoComponent } from './views/albums-view/albums-view-info/albums-view-info.component';
import { AlbumsViewPhotosComponent } from './views/albums-view/albums-view-photos/albums-view-photos.component';
import { AlbumsViewComponent } from './views/albums-view/albums-view.component';



const routes: Routes = [

  { path: 'vytvorit', component: AlbumsCreateComponent },

  { path: ':album/upravit', component: AlbumsEditComponent, },

  {
    path: ':album',
    component: AlbumsViewComponent,
    children: [
      { path: "info", component: AlbumsViewInfoComponent },
      { path: "fotky", component: AlbumsViewPhotosComponent },
      { path: "", pathMatch: "full", redirectTo: "info" }
    ]
  },

  { path: '', component: AlbumsListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
