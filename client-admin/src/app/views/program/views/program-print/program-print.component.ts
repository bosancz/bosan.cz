import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { ProgramExportService } from 'app/services/program-export.service';
import { Event } from 'app/shared/schema/event';

@Component({
  selector: 'bo-program-print',
  templateUrl: './program-print.component.html',
  styleUrls: ['./program-print.component.scss']
})
export class ProgramPrintComponent implements OnInit {

  dateRange?: [string, string];

  constructor(
    private api: ApiService,
    private programExport: ProgramExportService
  ) { }

  ngOnInit(): void {
  }

  async exportProgram(dateRange) {
    const requestOptions = {
      filter: {
        dateFrom: { $lte: this.dateRange[1] },
        dateTill: { $gte: this.dateRange[0] },
      },
      select: "_id name description dateFrom dateTill leaders"
    };

    const events = await this.api.get<Event[]>("events", requestOptions);

    this.programExport.export(events);
  }

}
