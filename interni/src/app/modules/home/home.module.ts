import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HomeCalendarComponent } from './components/home-calendar/home-calendar.component';
import { HomeDashboardComponent } from './components/home-dashboard/home-dashboard.component';
import { HomeMenuComponent } from './components/home-menu/home-menu.component';
import { NoleaderEventsComponent } from './components/noleader-events/noleader-events.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeCalendarViewComponent } from './views/home-calendar-view/home-calendar-view.component';
import { HomeMyEventsComponent } from './views/home-my-events/home-my-events.component';
import { HomeNoleaderEventsComponent } from './views/home-noleader-events/home-noleader-events.component';


@NgModule({
  declarations: [
    HomeDashboardComponent,
    HomeMyEventsComponent,
    HomeMenuComponent,
    HomeCalendarViewComponent,
    HomeComponent,
    HomeNoleaderEventsComponent,
    NoleaderEventsComponent,
    HomeCalendarComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
