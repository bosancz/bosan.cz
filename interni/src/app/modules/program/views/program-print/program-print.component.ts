import { Component, Injector, OnInit } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { ToastService } from 'app/core/services/toast.service';
import { Event } from 'app/schema/event';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { TrimesterDateRange } from '../../components/trimester-selector/trimester-selector.component';

@Component({
  selector: 'bo-program-print',
  templateUrl: './program-print.component.html',
  styleUrls: ['./program-print.component.scss']
})
export class ProgramPrintComponent implements OnInit {

  dateRange?: TrimesterDateRange;

  actions: Action[] = [];

  constructor(
    private api: ApiService,
    private toasts: ToastService,
    private injector: Injector
  ) { }

  ngOnInit(): void {
  }

  async exportProgram() {

    if (!this.dateRange) {
      this.toasts.toast("Nelze vygenerovat program, neplatné rozmezí.");
      return;
    }

    const requestOptions = {
      filter: {
        dateFrom: { $lte: this.dateRange[1] },
        dateTill: { $gte: this.dateRange[0] },
        status: "public"
      },
      select: "_id name description dateFrom dateTill leaders"
    };

    const events = await this.api.get<Event[]>("events", requestOptions);

    if (!events.length) {
      this.toasts.toast("Nelze vygenerovat program, ve vybraném rozmezí nejsou žádné akce.");
      return;
    }

    // lazy načítání ProgramExportService, je totiž závislá na obrovské (700k) docx knihovně
    const ProgramExportService = await import("../../services/program-export.service").then(f => f.ProgramExportService);
    const programExport = this.injector.get(ProgramExportService);

    programExport.export(events);

  }

}
