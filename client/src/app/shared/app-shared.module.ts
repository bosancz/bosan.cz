import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AclModule } from "lib/acl";
 
/* PIPES */
import { JoinLeadersPipe } from './pipes/join-leaders.pipe';
import { JoinAttendeesPipe } from './pipes/join-attendees.pipe';
import { GroupPipe } from "./pipes/group.pipe";
import { DateRangePipe } from "./pipes/date-range.pipe";
import { EventPipe } from "./pipes/event.pipe";
import { MonthNamePipe } from './pipes/month-name.pipe';
import { SafeurlPipe } from "./pipes/safeurl.pipe";
import { FormatPhonePipe } from './pipes/format-phone.pipe';

/* COMPONENTS */
import { SharingModalComponent } from './components/sharing-modal/sharing-modal.component';
import { ShareUrlDirective } from './directives/share-url.directive';
import { LoginFormComponent } from "./components/login-form/login-form.component";

/* DIRECTIVES */
import { AdminLinkDirective } from 'app/shared/directives/admin-link.directive';

/* THIRD PARTY */
import { CollapseModule } from "ngx-bootstrap/collapse";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ShareModule } from '@ngx-share/core';
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { TextcheckDirective } from './directives/textcheck.directive';

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
    BsDropdownModule.forRoot(),

    ScrollToModule.forRoot(),
    
    ShareModule
    
  ],
  declarations: [
    /* COMPONENTS */ SharingModalComponent, LoginFormComponent,
    /* DIRECTIVES */ ShareUrlDirective, AdminLinkDirective, TextcheckDirective,
    /* PIPES */ SafeurlPipe, GroupPipe, DateRangePipe, JoinLeadersPipe, JoinAttendeesPipe, EventPipe, MonthNamePipe, FormatPhonePipe,
  ],
  exports: [
    /* MODULES */ CommonModule, FormsModule, HttpClientModule,
    CollapseModule, ModalModule, TooltipModule, BsDropdownModule,
    ShareModule,
    
    AclModule,
    
    /* COMPONENTS */
    SharingModalComponent, LoginFormComponent,
    /* DIRECTIVES */
    ShareUrlDirective, AdminLinkDirective, TextcheckDirective,

    /* PIPES */
    SafeurlPipe, GroupPipe, DateRangePipe, JoinLeadersPipe, JoinAttendeesPipe, EventPipe, MonthNamePipe, FormatPhonePipe,
  ],
  providers: [    
    GroupPipe,
    { provide: TooltipConfig, useFactory: getTooltipConfig }
  ],
  entryComponents: [ LoginFormComponent, SharingModalComponent ]
  
})
export class AppSharedModule { }
