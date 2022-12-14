import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AlbumsEditComponent } from "./views/albums-edit/albums-edit.component";
import { AlbumsListComponent } from "./views/albums-list/albums-list.component";
import { AlbumsViewInfoComponent } from "./views/albums-view-info/albums-view-info.component";
import { AlbumsViewPhotosComponent } from "./views/albums-view-photos/albums-view-photos.component";

const routes: Routes = [
  { path: ":album/upravit", component: AlbumsEditComponent },

  { path: ":album/info", component: AlbumsViewInfoComponent },
  { path: ":album/fotky", component: AlbumsViewPhotosComponent },

  { path: ":album", pathMatch: "full", redirectTo: ":album/info" },

  { path: "", component: AlbumsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlbumsRoutingModule {}
