import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from "app/core/services/api.service";
import { Dashboard } from "app/shared/schema/dashboard";
import { TitleService } from 'app/core/services/title.service';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboard: Dashboard;

  constructor(
    private api: ApiService,
    private titleService: TitleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadNoLeaderEvents();
    this.titleService.setPageTitle("Přehled");
  }

  ngOnDestroy() {
    this.titleService.reset();
  }

  async loadNoLeaderEvents() {

    this.dashboard = await this.api.get<Dashboard>("me:dashboard");
  }

  openLeadEventModal() {
    this.router.navigate(["akce/vest-akci"], { relativeTo: this.route });
  }

}
