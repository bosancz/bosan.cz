import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AclModule } from "../lib/acl/acl.module";
 
/* PIPES */
import { JoinLeadersPipe } from 'app/pipes/join-leaders.pipe';
import { JoinAttendeesPipe } from 'app/pipes/join-attendees.pipe';
import { GroupPipe } from "app/pipes/group.pipe";
import { Nl2brPipe } from "app/pipes/nl2br.pipe";
import { DateRangePipe } from "app/pipes/date-range.pipe";
import { EventPipe } from "app/pipes/event.pipe";
import { MonthNamePipe } from 'app/pipes/month-name.pipe';
import { SafeurlPipe } from "app/pipes/safeurl.pipe";

/* THIRD PARTY */
import { CollapseModule } from "ngx-bootstrap/collapse";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { ShareModule } from '@ngx-share/core';

export function getTooltipConfig():TooltipConfig {
  return Object.assign(new TooltipConfig(), {    
    container: 'body'
  });
}
 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ShareModule.forRoot(),
    
    
  ],
  declarations: [
    /* PIPES */
    SafeurlPipe, GroupPipe, Nl2brPipe, DateRangePipe, JoinLeadersPipe, JoinAttendeesPipe, EventPipe, MonthNamePipe
  ],
  exports: [
    /* MODULES */ CommonModule, FormsModule, HttpClientModule,
    CollapseModule, ModalModule, TooltipModule,
    ShareModule,
    
    AclModule,
    
    /* PIPES */
    SafeurlPipe, GroupPipe, Nl2brPipe, DateRangePipe, JoinLeadersPipe, JoinAttendeesPipe, EventPipe, MonthNamePipe
  ],
  providers: [
    { provide: TooltipConfig, useFactory: getTooltipConfig }
  ]
  
})
export class AppSharedModule { }
