import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app/app.component';

/* VIEWS */
import { FrontPageComponent } from './app/views/front-page/front-page.component';
import { EventsAgendaComponent } from './app/views/events-agenda/events-agenda.component';

/* SHARED */
// Components
import { EventsListComponent } from './app/shared/components/events-list/events-list.component';

/* ROUTING */
import { routing } from './routing';

@NgModule({
  declarations: [
    AppComponent,
    /* VIEWS */ FrontPageComponent, EventsAgendaComponent,
    /* SHARED */ EventsListComponent
    
  ],
  imports: [
    BrowserModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
