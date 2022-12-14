import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { EventExpenseTypes } from 'app/config/event-expense-types';
import { EventExpense } from 'app/schema/event';

@Component({
  selector: 'bo-event-expense-modal',
  templateUrl: './event-expense-modal.component.html',
  styleUrls: ['./event-expense-modal.component.scss']
})
export class EventExpenseModalComponent implements OnInit {

  @Input() expense!: EventExpense;

  types = EventExpenseTypes;

  constructor(
    private modalController: ModalController,
    public platform: Platform
  ) { }

  ngOnInit(): void {
  }

  async save(expense: EventExpense) {
    await this.modalController.dismiss({ expense });
  }

  async close() {
    await this.modalController.dismiss();
  }
}
