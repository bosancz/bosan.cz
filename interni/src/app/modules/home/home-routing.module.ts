import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeCalendarViewComponent } from "./views/home-calendar-view/home-calendar-view.component";
import { HomeDashboardComponent } from "./views/home-dashboard/home-dashboard.component";
import { HomeMyEventsComponent } from "./views/home-my-events/home-my-events.component";
import { HomeNoleaderEventsComponent } from "./views/home-noleader-events/home-noleader-events.component";

const routes: Routes = [
  { path: "", component: HomeDashboardComponent },
  { path: "volne-akce", component: HomeNoleaderEventsComponent },
  { path: "moje-akce", component: HomeMyEventsComponent },
  { path: "kalendar", component: HomeCalendarViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
