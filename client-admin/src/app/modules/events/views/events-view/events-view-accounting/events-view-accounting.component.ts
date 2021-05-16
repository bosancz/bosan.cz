import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EventExpenseTypes } from 'app/config/event-expense-types';
import { EventExpenseModalComponent } from 'app/modules/events/components/event-expense-modal/event-expense-modal.component';
import { EventsService } from 'app/modules/events/services/events.service';
import { Event, EventExpense } from 'app/schema/event';
import { Action } from 'app/shared/components/action-buttons/action-buttons.component';

@UntilDestroy()
@Component({
  selector: 'bo-events-view-accounting',
  templateUrl: './events-view-accounting.component.html',
  styleUrls: ['./events-view-accounting.component.scss']
})
export class EventsViewAccountingComponent implements OnInit, OnDestroy {

  event?: Event;

  expenses: EventExpense[] = [];

  actions: Action[] = [
    {
      text: "Přidat",
      // icon: "add-outline",
      pinned: true,
      handler: () => this.editExpenseModal()
    },
    {
      text: "Stáhnout účtování",
      icon: "download-outline",
      handler: () => this.exportExcel()
    }
  ];

  modal?: HTMLIonModalElement;
  alert?: HTMLIonAlertElement;

  constructor(
    private eventsService: EventsService,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.eventsService.event$
      .pipe(untilDestroyed(this))
      .subscribe(event => {
        this.event = event;
        this.expenses = event?.expenses || [];
        this.sortExpenes();
      });
  }

  ngOnDestroy() {
    this.modal?.dismiss();
    this.alert?.dismiss();
  }

  private sortExpenes() {
    this.expenses.sort((a, b) => a.id.localeCompare(b.id));
  }

  async editExpenseModal(expense?: EventExpense) {

    const i = expense ? this.expenses.indexOf(expense) : -1;

    this.modal = await this.modalController.create({
      component: EventExpenseModalComponent,
      componentProps: {
        expense: expense || { id: "V" + (this.expenses.length + 1) }
      }
    });

    this.modal.onDidDismiss().then(ev => {
      if (ev.data?.expense) this.saveExpense(i, ev.data?.expense);
    });

    await this.modal.present();

  }

  async saveExpense(i: number, expense: EventExpense) {
    if (!this.event) return;

    const expenses = this.expenses.slice();

    if (i >= 0) expenses.splice(i, 1, expense);
    else expenses.push(expense);

    await this.eventsService.updateEvent(this.event._id, { expenses });
    await this.eventsService.loadEvent(this.event._id);
  }


  async removeExpense(expense: EventExpense) {
    this.alert = await this.alertController.create({
      header: "Smazat účtenku",
      message: `Opravdu chceš smazat účtenku ${expense.id}?`,
      buttons: [
        { role: "cancel", text: "Zrušit" },
        { role: "destructive", text: "Smazat", handler: () => this.removeExpenseConfirmed(expense) }
      ]
    });

    await this.alert.present();
  }

  async removeExpenseConfirmed(expense: EventExpense) {
    if (!this.event) return;

    const expenses = this.expenses.filter(item => item !== expense);

    await this.eventsService.updateEvent(this.event._id, { expenses });
    await this.eventsService.loadEvent(this.event._id);
  }

  private async exportExcel() {

  }

  toggleSliding(sliding: any) {
    sliding.getOpenAmount().then((open: number) => {
      if (open) sliding.close();
      else sliding.open();
    });
  }

  getExpenseColor(expense: EventExpense) {
    return EventExpenseTypes[expense.type]?.color || "primary";
  }
}
