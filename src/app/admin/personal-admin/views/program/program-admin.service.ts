import { Injectable } from '@angular/core';
import { ReplaySubject } from "rxjs";

import { ProgramAdminModule } from "./program-admin.module";

import { ApiService } from "app/core/services/api.service";

import { ProgramStats } from "app/core/schema/program-stats";

@Injectable({
  providedIn: ProgramAdminModule
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
