import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { ConfigService } from 'app/services/config.service';
import { WebConfigMemberRole } from 'app/shared/schema/web-config';

export interface MembersReport {

  count: number;

  roles: { [role: string]: number };
  ages: { [role: string]: { [age: string]: number } };
  cities: { [city: string]: number };

}

interface ChartData {
  labels: string[];
  datasets: { data: number[], label?: string }[];
}


@Component({
  selector: 'members-dashboard',
  templateUrl: './members-dashboard.component.html',
  styleUrls: ['./members-dashboard.component.scss']
})
export class MembersDashboardComponent implements OnInit {

  report: MembersReport;

  roles: WebConfigMemberRole[];
  cities: string[];

  agesData: ChartData;

  agesOptions = {
    scales: {
      xAxes: [{
        stacked: true,
      }],
      yAxes: [{
        stacked: true
      }]
    }
  }

  constructor(private api: ApiService, private config: ConfigService) { }

  ngOnInit() {
    this.loadReport();
    this.loadMemberRoles();
  }

  async loadReport() {
    this.report = await this.api.get<MembersReport>("reports:members");

    this.cities = Object.keys(this.report.cities);

    this.updateAgesData();

  }

  async loadMemberRoles() {
    const config = await this.config.getConfig();
    this.roles = config.members.roles;
  }

  fillMissingKeys(data: { [key: string]: number }, min: number, max: number) {
    for (let i = min; i <= max; i++) data[i] = data[i] || 0;
  }

  updateAgesData() {

    if (!this.report || !this.report.ages) return this.agesData = undefined;

    const min = Math.min(...Object.values(this.report.ages).map(roleAges => Math.min(...Object.keys(roleAges).map(age => Number(age)))));
    const max = Math.max(...Object.values(this.report.ages).map(roleAges => Math.max(...Object.keys(roleAges).map(age => Number(age)))));

    const agesData: ChartData = {
      labels: [],
      datasets: []
    };

    for (let i = min; i <= max; i++) agesData.labels.push(String(i));

    for (let role of Object.entries(this.report.ages)) {
      for (let i = min; i <= max; i++) role[1][i] = role[1][i] || 0;
      agesData.datasets.push({ data: Object.values(role[1]), label: role[0] })
    }

    agesData.datasets.sort((a,b) => a.label.localeCompare(b.label));

    this.agesData = agesData;
  }

  getRolesColClass(roles: any[]): string {
    return "col-" + Math.max(1, Math.floor(12 / ((roles ? roles.length : 0) + 1)));
  }

}
