import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

/* SERVICES */
import { DataService } from "./services/data.service";
import { ToastService } from "./services/toast.service";

/* VIEWS */
import { FrontPageComponent } from './views/front-page/front-page.component';
import { EventScheduleComponent } from './views/event-schedule/event-schedule.component';

/* SHARED */
// Components
import { EventsTimelineComponent } from './shared/events-timeline/events-timeline.component';
import { GoogleMapComponent } from './shared/google-map/google-map.component';
import { GroupColorPipe } from './pipes/group-color.pipe';

/* ROUTING */

@NgModule({
  declarations: [
    AppComponent,
    /* VIEWS */ FrontPageComponent, EventScheduleComponent,
    /* SHARED */ EventsTimelineComponent, GoogleMapComponent,
    
    /* PIPES */ GroupColorPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouting
  ],
  providers: [ DataService, ToastService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
