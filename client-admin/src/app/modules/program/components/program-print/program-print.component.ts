import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'app/core/services/api.service';
import { ProgramExportService } from 'app/core/services/program-export.service';
import { ToastService } from 'app/core/services/toast.service';
import { Event } from 'app/schema/event';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';
import { TrimesterDateRange } from '../trimester-selector/trimester-selector.component';

@Component({
  selector: 'bo-program-print',
  templateUrl: './program-print.component.html',
  styleUrls: ['./program-print.component.scss']
})
export class ProgramPrintComponent implements OnInit {

  dateRange?: TrimesterDateRange;

  actions: Action[] = [
    {
      text: "Zavřít",
      handler: () => this.close()
    }
  ];

  constructor(
    private api: ApiService,
    private programExport: ProgramExportService,
    private toasts: ToastService,
    private modalController: ModalController
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
      },
      select: "_id name description dateFrom dateTill leaders"
    };

    const events = await this.api.get<Event[]>("events", requestOptions);

    if (!events.length) {
      this.toasts.toast("Nelze vygenerovat program, ve vybraném rozmezí nejsou žádné akce.");
      return;
    }

    this.programExport.export(events);

  }

  close() {
    this.modalController.dismiss();
  }

}
