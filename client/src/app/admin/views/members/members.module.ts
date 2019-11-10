import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminSharedModule } from 'app/admin/shared/admin-shared.module';
import { AppSharedModule } from 'app/shared/app-shared.module';

import { MembersRoutingModule } from './members-routing.module';

import { MembersListComponent } from './members-list/members-list.component';
import { MembersViewComponent } from './members-view/members-view.component';

import { MembersViewAchievementsComponent } from './members-view/members-view-achievements/members-view-achievements.component';
import { MembersViewInfoComponent } from './members-view/members-view-info/members-view-info.component';


@NgModule({
  declarations: [
    MembersListComponent,
    MembersViewComponent,

    MembersViewAchievementsComponent,
    MembersViewInfoComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    AppSharedModule,
    AdminSharedModule
  ]
})
export class MembersModule { }
