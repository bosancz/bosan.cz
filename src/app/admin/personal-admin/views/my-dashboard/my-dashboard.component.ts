import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/core/services/api.service";

import { Dashboard } from "app/shared/schema/dashboard";

@Component({
  selector: 'my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.scss']
})
export class MyDashboardComponent implements OnInit {

  dashboard:Dashboard;
  
  constructor(private api:ApiService) { }

  ngOnInit() {
    this.loadNoLeaderEvents();
  }
  
  async loadNoLeaderEvents(){
    
    this.dashboard = await this.api.get<Dashboard>("me:dashboard");
  }

}
