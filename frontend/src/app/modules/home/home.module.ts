import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "app/shared/shared.module";
import { HomeCalendarComponent } from "./components/home-calendar/home-calendar.component";
import { HomeDashboardComponent } from "./views/home-dashboard/home-dashboard.component";
import { HomeMenuComponent } from "./components/home-menu/home-menu.component";
import { NoleaderEventsComponent } from "./components/noleader-events/noleader-events.component";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeCalendarViewComponent } from "./views/home-calendar-view/home-calendar-view.component";
import { HomeMyEventsComponent } from "./views/home-my-events/home-my-events.component";
import { HomeNoleaderEventsComponent } from "./views/home-noleader-events/home-noleader-events.component";
import { HomeCardMyEventsComponent } from "./components/home-card-my-events/home-card-my-events.component";
import { HomeCardMembersComponent } from "./components/home-card-members/home-card-members.component";
import { HomeCardComponent } from './components/home-card/home-card.component';
import { HomeCardTitleComponent } from './components/home-card-title/home-card-title.component';
import { HomeCardContentComponent } from './components/home-card-content/home-card-content.component';

@NgModule({
  declarations: [
    HomeDashboardComponent,
    HomeMyEventsComponent,
    HomeMenuComponent,
    HomeCalendarViewComponent,
    HomeNoleaderEventsComponent,
    NoleaderEventsComponent,
    HomeCalendarComponent,
    HomeCardMyEventsComponent,
    HomeCardMembersComponent,
    HomeCardComponent,
    HomeCardTitleComponent,
    HomeCardContentComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class DashboardModule {}
