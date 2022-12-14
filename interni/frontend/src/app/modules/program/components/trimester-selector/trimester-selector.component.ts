import { Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateTime } from 'luxon';

export type TrimesterDateRange = [string, string];

@Component({
  selector: 'bo-trimester-selector',
  templateUrl: './trimester-selector.component.html',
  styleUrls: ['./trimester-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TrimesterSelectorComponent),
      multi: true
    }
  ]
})
export class TrimesterSelectorComponent implements OnInit, ControlValueAccessor {

  @Input() lines?: string;
  @Input() labelPosition?: string;

  trimester?: number;
  year?: number;

  trimesterMonths = [[1, 4], [5, 8], [9, 12]]; // trimster months (jan-may, ...)

  /* ControlValueAccessor, implements the ngModel interface */
  private onTouched = () => { };
  private onChange = (value: TrimesterDateRange) => { };
  disabled: boolean = false;

  constructor() {
    this.setTrimesterByDate(DateTime.local());
  }

  /* ControlValueAccessor, implements the ngModel interface */
  writeValue(obj?: TrimesterDateRange): void {
    const dateFrom = obj?.[0];
    this.setTrimesterByDate(dateFrom ? DateTime.fromISO(dateFrom) : undefined);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
  }

  setTrimester() {
    if (!this.year || this.trimester === undefined) return;

    const dateFrom = DateTime.local(this.year, this.trimesterMonths[this.trimester][0], 1);
    const dateTill = DateTime.local(this.year, this.trimesterMonths[this.trimester][1], 1).plus({ months: 1 }).minus({ days: 1 });

    const value: TrimesterDateRange = [
      dateFrom.toISODate(),
      dateTill.toISODate(),
    ];

    this.onChange(value);
    this.onTouched();

  }

  setTrimesterByDate(dateFrom?: DateTime) {

    if (!dateFrom || !dateFrom.isValid) dateFrom = DateTime.local();

    this.year = dateFrom.year;
    this.trimester = this.trimesterMonths.findIndex(item => {
      return item[0] >= dateFrom!.month;
    });

    if (this.trimester === -1) {
      this.year++;
      this.trimester = 0;
    }

    this.setTrimester();

  }


}
