import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { ConfigService } from 'app/core/services/config.service';

export interface MembersReport {

  count: number;

  roles: { [role: string]: number };
  ages: { [age: string]: number };
  cities: { [city: string]: number };

}

@Component({
  selector: 'members-dashboard',
  templateUrl: './members-dashboard.component.html',
  styleUrls: ['./members-dashboard.component.scss']
})
export class MembersDashboardComponent implements OnInit {

  report: MembersReport;

  roles: string[];
  ages: string[];
  cities: string[];

  constructor(private api: ApiService, private config: ConfigService) { }

  ngOnInit() {
    this.loadReport();
    this.loadMemberRoles();
  }

  async loadReport() {
    this.report = await this.api.get<MembersReport>("reports:members");

    this.ages = Object.keys(this.report.ages);
    this.cities = Object.keys(this.report.cities);
  }

  async loadMemberRoles() {
    const config = await this.config.getConfig();
    this.roles = config.members.roles.map(role => role.id);
  }

}
