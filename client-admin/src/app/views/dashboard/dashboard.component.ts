import { Component, OnInit } from '@angular/core';
import { DateTime } from "luxon";

import { ApiService } from "app/services/api.service";

import { Dashboard } from "app/shared/schema/dashboard";
import { Event } from 'app/shared/schema/event';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashboard: Dashboard;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit() {
    this.loadDashboard();
  }

  async loadDashboard() {
    this.dashboard = await this.api.get<Dashboard>("me:dashboard");    
  }

}
