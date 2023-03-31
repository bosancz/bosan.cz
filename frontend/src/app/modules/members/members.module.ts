import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';


import { MembersRoutingModule } from './members-routing.module';

import { MembersListComponent } from './views/members-list/members-list.component';
import { MembersViewComponent } from './views/members-view/members-view.component';
import { MembersEditComponent } from './views/members-edit/members-edit.component';
import { MembersCreateComponent } from './views/members-create/members-create.component';
import { CardAllergiesComponent } from './components/card-allergies/card-allergies.component';
import { CardPersonalInfoComponent } from './components/card-personal-info/card-personal-info.component';
import { CardContactsComponent } from './components/card-contacts/card-contacts.component';
import { CardInsuranceComponent } from './components/card-insurance/card-insurance.component';
import { CardMembershipComponent } from './components/card-membership/card-membership.component';


@NgModule({
  declarations: [
    MembersListComponent,
    MembersViewComponent,
    MembersEditComponent,
    MembersCreateComponent,
    CardAllergiesComponent,
    CardPersonalInfoComponent,
    CardContactsComponent,
    CardInsuranceComponent,
    CardMembershipComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,

    SharedModule,
  ]
})
export class MembersModule { }
