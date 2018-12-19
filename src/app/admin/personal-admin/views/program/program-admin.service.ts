import { Injectable } from '@angular/core';
import { ReplaySubject } from "rxjs";

import { ApiService } from "app/services/api.service";

import { ProgramStats } from "app/schema/program-stats";

@Injectable({
  providedIn: 'root'
})
export class ProgramAdminService {
  
  stats:ReplaySubject<ProgramStats> = new ReplaySubject(1);

  constructor(private api:ApiService) {
    this.loadStats();
  }
  
  async loadStats(){
    this.stats.next(await this.api.get<ProgramStats>("program:stats"));
  }

}
