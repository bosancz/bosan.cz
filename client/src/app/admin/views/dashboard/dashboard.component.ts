import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/core/services/api.service";

import { Dashboard } from "app/shared/schema/dashboard";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LeadEventModalComponent } from '../../components/lead-event-modal/lead-event-modal.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboard: Dashboard;

  leadEventModalRef: BsModalRef;

  constructor(private api: ApiService, private modalService: BsModalService) { }

  ngOnInit() {
    this.loadNoLeaderEvents();
  }

  async loadNoLeaderEvents() {

    this.dashboard = await this.api.get<Dashboard>("me:dashboard");
  }

  openLeadEventModal() {
    this.leadEventModalRef = this.modalService.show(LeadEventModalComponent, { class: 'modal-lg' });
  }

}
