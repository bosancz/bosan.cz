import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';

import { ApiService } from 'app/core/services/api.service';

import { Member } from "app/schema/member";
import { Event } from "app/schema/event";
import { MemberGroupID } from 'app/config/member-groups';

export interface PaddlerCompetitionRanking {

  rank?: number;
  rankTo?: number;

  water_km: number;

  member?: Member;
  group?: MemberGroupID;
  events?: Event[];

}

export interface PaddlerCompetitionGroupRanking {

  rank?: number;
  rankTo?: number;

  water_km: number;

  group?: MemberGroupID;
  events?: Event[];

}

@Component({
  selector: 'paddler-competition',
  templateUrl: './paddler-competition.component.html',
  styleUrls: ['./paddler-competition.component.scss']
})
export class PaddlerCompetitionComponent implements OnInit {

  years: number[] = [];
  year = this.route.params.pipe(map((params: Params) => Number(params.year) || null));
  currentYear?: number;

  rankings: PaddlerCompetitionRanking[] = [];
  groups: PaddlerCompetitionGroupRanking[] = [];

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {
    this.year
      .pipe(filter((year): year is Exclude<typeof year, null> => !!year))
      .pipe(debounceTime(500))
      .subscribe(year => {
        this.loadRanking(year);
        this.currentYear = Number(year);
      });
  }

  ngOnInit() {
    this.loadYears();
  }

  async loadYears() {
    this.years = await this.api.get<number[]>("competition:years");
    this.years.sort();
    if (!this.currentYear) this.setYear(this.years[this.years.length - 1]);
  }

  async loadRanking(year: number) {
    const rankings = await this.api.get<PaddlerCompetitionRanking[]>("competition:ranking", { year: year });

    this.rankings = this.setRanks(rankings);

    const groups: { [key: string]: PaddlerCompetitionRanking; } = {};

    this.rankings.forEach(item => {
      if (!item.member?.group) return;

      if (!groups[item.member.group]) groups[item.member.group] = { group: item.member.group, water_km: 0 };

      groups[item.member.group].water_km += item.water_km;
    });

    this.groups = this.setRanks(Object.values(groups));
  }

  setYear(year: number) {
    this.router.navigate(["./", { year: year }], { relativeTo: this.route });
  }

  setRanks(ranking: PaddlerCompetitionRanking[]): PaddlerCompetitionRanking[] {
    ranking.sort((a, b) => b.water_km - a.water_km);

    let ranked = [];

    for (let i = 0; i < ranking.length; i++) {

      ranked.push(ranking[i]);

      if (!ranking[i + 1] || ranking[i + 1].water_km !== ranking[i].water_km) {
        ranked.forEach(rankedItem => {
          rankedItem.rank = (i + 1) - (ranked.length - 1);
          rankedItem.rankTo = (i + 1);
        });
        ranked = [];
      }

    }

    return ranking;
  }

}
