import { Component, Input, forwardRef } from '@angular/core';

import { Event, EventExpense } from "app/shared/schema/event";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { WebConfigEventExpenseType } from 'app/shared/schema/webconfig';
import { ConfigService } from 'app/core/services/config.service';

class ExpenseRow {
  editing: boolean = false;
  previousValue: EventExpense = null;
  constructor(public expense: EventExpense) { }
}

@Component({
  selector: 'event-expenses-table',
  templateUrl: './event-expenses-table.component.html',
  styleUrls: ['./event-expenses-table.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EventExpensesTableComponent),
    }
  ]
})
export class EventExpensesTableComponent implements ControlValueAccessor {

  @Input() persons: number;
  @Input() days: number;

  expenses: ExpenseRow[] = [];

  types: string[] = [];

  onChange: any = () => { };
  onTouched: any = () => { };

  disabled: boolean = false;
  @Input() readonly: boolean;

  constructor(configService: ConfigService) {
    configService.config.subscribe(config => this.types = config.events.expenseTypes.map(type => type.name));
  }

  getExpensesByType(type: string) {
    return this.expenses.filter(row => row.expense.type === type);
  }

  getExpensesOther() {
    return this.expenses.filter(row => this.types.indexOf(row.expense.type) === -1);
  }

  sumExpenses(expenses: ExpenseRow[]) {
    if (!expenses) return 0;
    return expenses.reduce((acc, cur) => acc + (cur.expense.amount || 0), 0)
  }

  perDayPerson(amount: number) {
    return Math.round((amount || 0) / this.days / this.persons * 100) / 100;
  }

  addExpense(type: string) {
    const row = new ExpenseRow(new EventExpense());
    row.expense.type = type;
    row.editing = true;
    row.expense.id = "V" + (this.expenses.reduce((acc, cur) => Math.max(acc, Number(cur.expense.id.substr(1)) || 0), 0) + 1);
    this.expenses.push(row);
    this.onTouched();
  }

  removeExpense(row: ExpenseRow) {
    this.expenses.splice(this.expenses.indexOf(row), 1);
    this.publishValue();
  }

  editExpense(row: ExpenseRow) {
    row.editing = true;
    row.previousValue = JSON.parse(JSON.stringify(row.expense));
    this.onTouched();
  }

  resetExpense(row: ExpenseRow) {
    if(row.previousValue) {
      row.expense = row.previousValue;
      row.previousValue = null;   
      row.editing = false;   
    }
    else{
      this.expenses.splice(this.expenses.indexOf(row), 1);
    }
  }

  saveExpense(row: ExpenseRow) {
    row.editing = false;
    this.publishValue();
  }

  publishValue() {
    this.onChange(this.expenses.map(row => row.expense));
  }

  /* ControlValueAccessor */
  writeValue(value: EventExpense[]) {
    this.expenses = value ? value.map(expense => new ExpenseRow(expense)) : [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }


}
