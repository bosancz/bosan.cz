import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { NgChartsModule } from "ng2-charts";
import { ListSliderComponent } from "./components/list-slider/list-slider.component";
import { StatisticsRoutingModule } from "./statistics-routing.module";
import { StatisticsComponent } from "./statistics.component";
import { EventsDashboardComponent } from "./views/events-dashboard/events-dashboard.component";
import { MembersDashboardComponent } from "./views/members-dashboard/members-dashboard.component";
import { PaddlerCompetitionComponent } from "./views/paddler-competition/paddler-competition.component";

@NgModule({
  declarations: [
    StatisticsComponent,
    EventsDashboardComponent,
    MembersDashboardComponent,
    PaddlerCompetitionComponent,
    ListSliderComponent,
  ],
  imports: [CommonModule, SharedModule, StatisticsRoutingModule, NgChartsModule],
})
export class StatisticsModule {}
