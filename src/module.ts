import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';

/* SERVICES */
import { DataService } from "./app/services/data.service";
import { ToastService } from "./app/services/toast.service";

/* VIEWS */
import { FrontPageComponent } from './app/views/front-page/front-page.component';
import { EventsAgendaComponent } from './app/views/events-agenda/events-agenda.component';

/* SHARED */
// Components
import { EventsTimelineComponent } from './app/shared/events-timeline/events-timeline.component';

/* ROUTING */
import { routing } from './routing';

@NgModule({
  declarations: [
    AppComponent,
    /* VIEWS */ FrontPageComponent, EventsAgendaComponent,
    /* SHARED */ EventsTimelineComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    routing
  ],
  providers: [ DataService, ToastService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
