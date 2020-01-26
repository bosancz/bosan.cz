import { Component, OnInit, OnDestroy } from '@angular/core';

import { ApiService } from "app/core/services/api.service";

import { Dashboard } from "app/shared/schema/dashboard";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LeadEventModalComponent } from '../../components/lead-event-modal/lead-event-modal.component';
import { TitleService } from 'app/core/services/title.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboard: Dashboard;

  leadEventModalRef: BsModalRef;

  constructor(private api: ApiService, private modalService: BsModalService, private titleService: TitleService) { }

  ngOnInit() {
    this.loadNoLeaderEvents();
    this.titleService.setPageTitle("Přehled");
  }

  ngOnDestroy(){
    this.titleService.reset();
  }

  async loadNoLeaderEvents() {

    this.dashboard = await this.api.get<Dashboard>("me:dashboard");
  }

  openLeadEventModal() {
    this.leadEventModalRef = this.modalService.show(LeadEventModalComponent, { class: 'modal-lg' });
  }

}
