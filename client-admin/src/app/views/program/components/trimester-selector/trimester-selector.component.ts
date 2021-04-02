import { Component, forwardRef, OnInit, Output } from '@angular/core';
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

  trimester: number;
  year: number;

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
    let dateFrom = DateTime.fromISO(obj?.[0]);
    this.setTrimesterByDate(dateFrom);
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

  previousTrimester() {
    if (this.trimester === 0) return { rok: this.year - 1, trimestr: this.trimesterMonths.length - 1 };
    else return { rok: this.year, trimestr: this.trimester - 1 };
  }
  nextTrimester() {
    if (this.trimester === this.trimesterMonths.length - 1) return { rok: this.year + 1, trimestr: 0 };
    else return { rok: this.year, trimestr: this.trimester + 1 };
  }

  setTrimester() {

    const dateFrom = DateTime.local(this.year, this.trimesterMonths[this.trimester][0], 1);
    const dateTill = DateTime.local(this.year, this.trimesterMonths[this.trimester][1], 1).plus({ months: 1 }).minus({ days: 1 });

    const value: TrimesterDateRange = [
      dateFrom.toISODate(),
      dateTill.toISODate(),
    ];

    this.onChange(value);

  }

  setTrimesterByDate(dateFrom: DateTime) {

    if (!dateFrom.isValid) dateFrom = DateTime.local();

    this.year = dateFrom.year;
    this.trimester = this.trimesterMonths.findIndex(item => {
      return item[0] >= dateFrom.month;
    });

    if (this.trimester === -1) {
      this.year++;
      this.trimester = 0;
    }

    this.setTrimester();

  }


}
