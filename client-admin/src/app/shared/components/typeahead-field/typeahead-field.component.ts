import { Component, Input, forwardRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'typeahead-field',
  templateUrl: './typeahead-field.component.html',
  styleUrls: ['./typeahead-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TypeaheadFieldComponent),
    }
  ]
})
export class TypeaheadFieldComponent implements ControlValueAccessor, OnInit {

  @Input() toStringFn: (item: any) => string;
  @Input() matched: any[];
  @Input() delay: number = 250;

  @Output() search: EventEmitter<string> = new EventEmitter();

  searchString$ = new Subject<string>();

  selected: any;

  onChange: any;
  onTouched: any;

  disabled: boolean = false;

  constructor() {

  }

  ngOnInit() {
    this.searchString$
      .pipe(debounceTime(this.delay))
      .subscribe(searchString => this.search.emit(searchString));
  }

  writeValue(item: any): void { this.selected = item; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  getItemString(item: any): string {
    return this.toStringFn ? this.toStringFn(item) : String(item);
  }

  selectItem(item: any): void {
    this.selected = item;
    this.onChange(this.selected);
  }

  // onTypeaheadSelected(match:TypeaheadMatch):void{
  //   this.selectItem(match.item);
  // }

}
